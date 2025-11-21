import AnalyticsClient from './AnalyticsClient';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AnalyticsClient warehouseId={Number(id)} />;
}
