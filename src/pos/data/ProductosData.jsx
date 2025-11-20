import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllThunks } from '../../store/productoStore/productoThunks';

export const MOCK_PRODUCTS = [
    { id: 1, name: 'Laptop Pro X',           price: 1200.00, img: 'https://placehold.co/150x100/2980b9/ffffff?text=Laptop' },
    { id: 2, name: 'Mouse Inalámbrico',      price: 25.00, img: 'https://placehold.co/150x100/34495e/ffffff?text=Mouse' },
    { id: 3, name: 'Teclado Mecánico RGB',   price: 75.00, img: 'https://placehold.co/150x100/1abc9c/ffffff?text=Teclado' },
    { id: 4, name: 'Monitor 27 Pulgadas', price: 350.00, img: 'https://placehold.co/150x100/f1c40f/ffffff?text=Monitor' },
    { id: 5, name: 'Webcam Full HD', price: 55.00, img: 'https://placehold.co/150x100/e67e22/ffffff?text=Webcam' },
    { id: 6, name: 'Disco SSD 1TB', price: 99.00, img: 'https://placehold.co/150x100/e74c3c/ffffff?text=SSD' },
    { id: 7, name: 'Auriculares Gaming', price: 80.00, img: 'https://placehold.co/150x100/9b59b6/ffffff?text=Audifonos' },
    { id: 8, name: 'Router Wi-Fi 6', price: 120.00, img: 'https://placehold.co/150x100/3498db/ffffff?text=Router' },
];


export const ProductosData = () => {

    const dispatch = useDispatch();

  const { productos } = useSelector((state) => state.productoStore);

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(30);

  useEffect(() => {
    dispatch(getAllThunks({ page: page + 1, pageSize }));
  }, [dispatch, page, pageSize]);

  // Validación segura
  const results = productos?.results;
  if (Array.isArray(results) && results.length > 0) {
    return results;
  }

  return [];
};