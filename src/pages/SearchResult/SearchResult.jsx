import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import style from './SearchResult.module.scss';
import * as http from '~/utils/http';
import ProductByCategory from '~/components/ProductByCategory';
import { changeState } from '~/features/loader/loaderSlice';

const cx = classNames.bind(style);

function SearchResult() {
    const location = useLocation();
    const dispatch = useDispatch();

    const [products, setProducts] = useState([]);
    const [displayKeyword, setDisplayKeyword] = useState('');

    const keyword = useSelector(state => state.search.keyword);

    useEffect(() => {
        dispatch(changeState(true));
        let url;
        if (keyword) {
            url = `product/search?name=${keyword}`;
            setDisplayKeyword(keyword);
        } else {
            const searchParams = new URLSearchParams(location.search);
            url = `product/search?name=${searchParams.get('name')}`;
            setDisplayKeyword(searchParams.get('name'));
        }
        http.get(http.Dyoss, url).then(res => {
            setProducts(res);
            dispatch(changeState(false));
        });
    }, [keyword, location.search, dispatch]);

    return (
        <main className={cx('search-page')}>
            <div className={cx('container')}>
                {products.length > 0 ? (
                    <ProductByCategory
                        title={`Search Result: "${displayKeyword}"`}
                        listProduct={products}
                    />
                ) : (
                    <h2 className={cx('not-found')}>
                        Không tìm thấy kết quả cho "{displayKeyword}"
                    </h2>
                )}
            </div>
        </main>
    );
}

export default SearchResult;
