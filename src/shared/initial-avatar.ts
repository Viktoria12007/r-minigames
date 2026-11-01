export default function initialAvatar(name: string): string | null {
  const words = name.trim().split(/\s+/u).filter(Boolean);
  const characters = words
    .slice(0, 2)
    .map((word) => word.match(/[\p{L}\p{N}]/u)?.[0]?.toLocaleUpperCase())
    .filter((character): character is string => Boolean(character));
  return characters.length > 0 ? characters.join('') : null;
}
