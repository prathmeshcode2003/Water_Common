export async function searchConsumer(query: string) {
    const response = await fetch(`/api/wtis/search-consumer?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Consumer not found');
    return response.json();
}
