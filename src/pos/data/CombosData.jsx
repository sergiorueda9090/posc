import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getActiveCombosThunks } from '../../store/comboStore/comboThunks';

export const CombosData = () => {
  const dispatch = useDispatch();
  const { combosActivos } = useSelector((state) => state.comboStore);

  useEffect(() => {
    dispatch(getActiveCombosThunks());
  }, [dispatch]);

  // Validación segura
  if (Array.isArray(combosActivos) && combosActivos.length > 0) {
    return combosActivos;
  }

  return [];
};
