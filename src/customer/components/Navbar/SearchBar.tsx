import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { ClickAwayListener, IconButton, InputBase, Paper } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchProduct } from '../../../State/customer/ProductSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import type { Product } from '../../../types/ProductTypes';
import { formatVND } from '../../../Util/formatCurrency';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { searchProduct: searchResults, loading } = useAppSelector(store => store.product);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length > 0) {
      searchTimeoutRef.current = setTimeout(() => {
        dispatch(searchProduct(searchQuery));
        setShowResults(true);
      }, 300);
    } else {
      setShowResults(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, dispatch]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleProductClick = (productId: number, item: Product) => {
    navigate(`/product-details/${item.category?.parentCategory?.categoryId}/${item.category?.categoryId}/${item.title}/${item.id}`);
    setSearchQuery('');
    setShowResults(false);
    setIsExpanded(false);
  };

  const handleClear = () => {
    setSearchQuery('');
    setShowResults(false);
  };

  const handleClickAway = () => {
    if (!searchQuery) {
      setIsExpanded(false);
    }
    setShowResults(false);
  };

  const handleSearchIconClick = () => {
    setIsExpanded(true);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className="relative">
        {/* Collapsed State - Just Icon */}
        {!isExpanded && (
          <IconButton onClick={handleSearchIconClick}>
            <SearchIcon className="text-gray-700" sx={{ fontSize: 29 }} />
          </IconButton>
        )}

        {/* Expanded State - Full Search Bar */}
        {isExpanded && (
          <>
            <Paper
              component="form"
              onSubmit={(e) => e.preventDefault()}
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: { xs: 280, sm: 350, md: 400 },
                height: 40,
                borderRadius: '20px',
                px: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '2px solid #E27E6A',
                transition: 'all 0.3s ease',
              }}
            >
              <SearchIcon sx={{ color: '#E27E6A', mr: 1 }} />
              <InputBase
                inputRef={inputRef}
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ flex: 1, fontSize: 14 }}
              />
              <IconButton size="small" onClick={() => {
                setSearchQuery('');
                setShowResults(false);
                setIsExpanded(false);
              }}>
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Paper>

            {/* Search Results Dropdown */}
            {showResults && searchQuery.trim().length > 0 && (
              <Paper
                sx={{
                  position: 'absolute',
                  top: '45px',
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  borderRadius: '8px',
                  overflow: 'hidden' // Hide overflow for Paper to contain blur
                }}
              >
                {loading ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                      Searching...
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="relative">
                    <div className="max-h-[160px] overflow-y-auto">
                      <div className="py-2">
                        {searchResults.map((product: Product) => (
                          <div
                            key={product.id}
                            onClick={() => handleProductClick(product.id || 0, product)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-teal-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                          >
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-14 h-14 object-cover rounded-md shadow-sm"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {product.title}
                              </h3>
                              <p className="text-xs text-gray-500 truncate">
                                {product.seller?.businessDetails?.businessName}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-teal-600">
                                {formatVND(product.sellingPrice)}
                              </p>
                              {product.msrpPrice > product.sellingPrice && (
                                <p className="text-xs text-gray-400 line-through">
                                  {formatVND(product.msrpPrice)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Blur Effect Overlay - Only show if more than 2 results */}
                    {searchResults.length > 2 && (
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">No products found for <span className="font-semibold">"{searchQuery}"</span></p>
                  </div>
                )}
              </Paper>
            )}
          </>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default SearchBar;
