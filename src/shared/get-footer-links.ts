export default function getFooterLinks(): Array<[string, Array<[string, string]>]> {
  return [
    [
      'Explore',
      [
        ['Home', '/'],
        ['Library', 'library'],
        ['Categories', 'categories'],
        ['Tournaments', 'tournaments'],
      ],
    ],
    [
      'Company',
      [
        ['About Us', 'about'],
        ['Contact', 'contact'],
        ['Privacy Policy', 'privacy'],
        ['Terms of Service', 'terms'],
      ],
    ],
    [
      'Community',
      [
        ['Share', 'share'],
        ['Chat', 'chat'],
        ['Feed', 'feed'],
      ],
    ],
  ];
}
