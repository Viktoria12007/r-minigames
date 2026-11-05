import { useCallback, useEffect, useRef, useState } from 'react';
import type { Category, Status } from '../../types/types.ts';
import { useSearchParams } from 'react-router';
import { getApi } from '../../shared/api.ts';
import { useSnackbar } from '../../hooks/use-snackbar.ts';

const sortOptions = [
  { value: 'rating-desc', label: 'Rating ↓' },
  { value: 'rating-asc', label: 'Rating ↑' },
  { value: 'name-asc', label: 'Name A→Z' },
  { value: 'name-desc', label: 'Name Z→A' },
] as const;

export default function Intro() {
  const { showSnackbar } = useSnackbar();
  const [_, setStatus] = useState<Status>('loading');
  const [searchParameters, setSearchParameters] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const controllerReference = useRef<AbortController | null>(null);

  const categorySearch = searchParameters.get('category');
  const sortSearch = searchParameters.get('sort');

  const currentCategory = categorySearch ?? 'all';
  const currentSort = sortSearch ?? sortOptions[0].value;

  const fetchCategories = useCallback(() => {
    controllerReference.current?.abort();

    const controller = new AbortController();
    controllerReference.current = controller;

    void getApi<Category[]>('/categories', controller.signal)
      .then(({ data }) => {
        if (controller.signal.aborted) return;

        setCategories(data);
        setStatus(data.length === 0 ? 'empty' : 'success');
      })
      .catch(() => {
        if (controller.signal.aborted) return;

        setStatus('error');
        showSnackbar('Games could not be loaded. Please try again.', 'error');
      })
      .finally(() => {
        if (controllerReference.current === controller) {
          controllerReference.current = null;
        }
      });
  }, [showSnackbar]);

  useEffect(() => {
    fetchCategories();

    return () => {
      controllerReference.current?.abort();
    };
  }, [fetchCategories]);

  function onSelectCategory(selectedCategory: string) {
    setSearchParameters((previous) => {
      const next = new URLSearchParams(previous);
      if (selectedCategory === 'all') {
        next.delete('category');
      } else {
        next.set('category', selectedCategory);
      }
      next.delete('page');
      return next;
    });
  }

  function onSelectSort(selectedSort: string) {
    setIsOpen(false);
    if (sortSearch === selectedSort) return;
    setSearchParameters((previous) => {
      const next = new URLSearchParams(previous);
      next.set('sort', selectedSort);
      next.delete('page');
      return next;
    });
  }

  function onToggleSortList() {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <div className="library-page__intro">
        <h1 className="library-page__title">Game Library</h1>
        <p className="library-page__lead">Browse our collection of casual mini-games</p>
      </div>
      <div className="library-controls">
        <div className="library-controls__chips">
          {categories.map((category) => (
            <button
              key={category.slug}
              className={`library-controls__chip ${category.slug === currentCategory ? 'is-active' : ''}`}
              onClick={() => onSelectCategory(category.slug)}
            >
              {category.label}
            </button>
          ))}
        </div>
        <div className={`library-controls__sort ${isOpen ? 'is-open' : ''}`}>
          <div className="library-controls__sort-list">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                className={`library-controls__sort-option ${option.value === currentSort ? 'is-active' : ''}`}
                onClick={() => onSelectSort(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button className="library-controls__sort-button" onClick={onToggleSortList}>
            {`Sort by: ${sortOptions.find((option) => option.value === currentSort)?.label}`}
          </button>
        </div>
      </div>
    </>
  );
}
