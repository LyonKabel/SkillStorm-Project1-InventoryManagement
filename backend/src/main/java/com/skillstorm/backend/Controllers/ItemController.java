package com.skillstorm.backend.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.backend.Item;
import com.skillstorm.backend.Repositories.ItemRepository;
import com.skillstorm.backend.Repositories.WarehouseRepository;
import com.skillstorm.backend.Variant;
import com.skillstorm.backend.Warehouse;

@RestController
@RequestMapping("/warehouses/{warehouseId}/items")
@CrossOrigin(origins = "http://localhost:3000")
public class ItemController {

    @Autowired
    private ItemRepository itemRepo;

    @Autowired
    private WarehouseRepository warehouseRepo;

    // GET all items for a warehouse
    @GetMapping
    public List<Item> getItems(@PathVariable Long warehouseId) {
        return itemRepo.findByWarehouse_WarehouseId(warehouseId);
    }

    // CREATE item in warehouse
    @PostMapping
    public Item createItem(
        @PathVariable Long warehouseId,
        @RequestBody Item item
    ) {
        Warehouse warehouse = warehouseRepo.findById(warehouseId)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        item.setWarehouse(warehouse);

        // Set parent reference
        item.getVariants().forEach(v -> v.setItem(item));

        // Calculate total quantity
        long totalQuantity = item.getVariants()
            .stream()
            .mapToLong(Variant::getQuantityVariant)
            .sum();

        item.setQuantity(totalQuantity);

        return itemRepo.save(item);
    }

    // UPDATE item
    @PutMapping("/{itemId}")
    public Item updateItem(
        @PathVariable Long itemId,
        @RequestBody Item updatedItem) {

        return itemRepo.findById(itemId)
                .map(item -> {
                    item.setName(updatedItem.getName());
                    item.setDescription(updatedItem.getDescription());

                    // Clear old variants
                    item.getVariants().clear();

                    // Add new variants
                    updatedItem.getVariants().forEach(v -> {
                        v.setItem(item);
                        item.getVariants().add(v);
                    });

                    // Recalculate total quantity
                    long totalQuantity = item.getVariants()
                        .stream()
                        .mapToLong(Variant::getQuantityVariant)
                        .sum();

                    item.setQuantity(totalQuantity);

                    return itemRepo.save(item);
                })
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }

    // DELETE item
    @DeleteMapping("/{itemId}")
    public String deleteItem(@PathVariable Long itemId) {
        itemRepo.deleteById(itemId);
        return "Item deleted";
    }

}
