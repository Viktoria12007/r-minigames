import {baseUrl} from "./base-url.ts";

export default function getHeaderLinks() {
    return [
        { text: 'Home', href: baseUrl },
        { text: 'Library', href: `${baseUrl}library`},
        { text: 'Tournaments', href: `${baseUrl}tournaments`},
        { text: 'Community', href: `${baseUrl}community`},
    ].map(link => ({ ...link, className: location.pathname === link.href ? 'is-active' : ''}));
}
