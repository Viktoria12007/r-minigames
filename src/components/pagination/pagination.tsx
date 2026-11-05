import {useSearchParams} from "react-router";

interface IPaginationProperties {
    totalPages: number;
}

export default function Pagination({ totalPages }: IPaginationProperties) {
    const [searchParameters, setSearchParameters] = useSearchParams();

    const page = searchParameters.get('page');
    const currentPage = page ? Number(page) : 1;

    const visible = matchMedia('(max-width: 480px)').matches ? 3 : 4;
    const count = Math.min(visible, totalPages);
    const start = Math.min(Math.max(1, currentPage - 1), Math.max(1, totalPages - count + 1));

    function onPageChange(page: number) {
        const pageString = page.toString();
        if (pageString === searchParameters.get('page') || page < 1) return;
        setSearchParameters((previous => {
            const next = new URLSearchParams(previous);

            if (page === 1) {
                next.delete('page');
            } else {
                next.set('page', pageString);
            }

            return next;
        }));
    }

    return (
        <nav className="pagination">
            <button
                className='pagination__button'
                aria-label='Previous page'
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                ‹
            </button>
            {Array.from({ length: count }, (_, index) => {
                    const page = start + index;
                return (<button
                    key={index}
                    className={`pagination__button ${page === currentPage ? 'is-active' : ''}`}
                    aria-current={page === currentPage ? 'page' : 'false'}
                    onClick={() => onPageChange(page)}
                >
                            {page}
                        </button>)
            }

            )}
            <button
                className='pagination__button'
                aria-label='Next page'
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                ›
            </button>
        </nav>
    )
}
