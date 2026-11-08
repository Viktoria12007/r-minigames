export function formatLikes(likes: number): string {
    return likes >= 1000 ? `${(likes / 1000).toFixed(1)}K` : String(likes);
}
