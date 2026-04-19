import PageLayout from '@/components/PageLayout/PageLayout';

export default function Loading() {
    return <PageLayout tracks={[]} title='Загрузка...' isLoading={true} />;
}
