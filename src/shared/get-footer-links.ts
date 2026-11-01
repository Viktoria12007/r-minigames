import {baseUrl} from "./base-url.ts";

export default function getFooterLinks(): Array<[string, Array<[string, string, string]>]> {
    return [
        [
            'Explore',
            [
                [
                    'Home',
                    baseUrl,
                    location.pathname === baseUrl || location.pathname === `${baseUrl}home`
                        ? 'is-active'
                        : '',
                ],
                [
                    'Library',
                    `${baseUrl}library`,
                    location.pathname === `${baseUrl}library` ? 'is-active' : '',
                ],
                [
                    'Categories',
                    `${baseUrl}categories`,
                    location.pathname === `${baseUrl}categories` ? 'is-active' : '',
                ],
                [
                    'Tournaments',
                    `${baseUrl}tournaments`,
                    location.pathname === `${baseUrl}tournaments` ? 'is-active' : '',
                ],
            ],
        ],
        [
            'Company',
            [
                ['About Us', `${baseUrl}about`, location.pathname === `${baseUrl}about` ? 'is-active' : ''],
                [
                    'Contact',
                    `${baseUrl}contact`,
                    location.pathname === `${baseUrl}contact` ? 'is-active' : '',
                ],
                [
                    'Privacy Policy',
                    `${baseUrl}privacy`,
                    location.pathname === `${baseUrl}privacy` ? 'is-active' : '',
                ],
                [
                    'Terms of Service',
                    `${baseUrl}terms`,
                    location.pathname === `${baseUrl}terms` ? 'is-active' : '',
                ],
            ],
        ],
        [
            'Community',
            [
                ['Share', `${baseUrl}share`, location.pathname === `${baseUrl}share` ? 'is-active' : ''],
                ['Chat', `${baseUrl}chat`, location.pathname === `${baseUrl}chat` ? 'is-active' : ''],
                ['Feed', `${baseUrl}feed`, location.pathname === `${baseUrl}feed` ? 'is-active' : ''],
            ],
        ],
    ]
}
