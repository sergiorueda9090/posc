import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { getAllThunks as getAllCategorias } from "../../store/categoriaStore/categoriaThunks";
import { handleFormStoreThunk } from "../../store/subcategoriaStore/subcategoriaThunks";

export const SelectComponent = () => {
  const dispatch = useDispatch();
  const { categorias } = useSelector((state) => state.categoriaStore);
  const subcategorias = useSelector((state) => state.subcategoriaStore);

  const [options, setOptions] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  //Cargar categorías al montar
  useEffect(() => {
    dispatch(getAllCategorias());
  }, [dispatch]);

  //Mapear categorías al formato { value, label }
  useEffect(() => {
    if (categorias?.results) {
      const newOptions = categorias.results.map((cat) => ({
        value: cat.id,
        label: cat.nombre,
      }));

      setOptions((prev) =>
        categorias.previous ? [...prev, ...newOptions] : newOptions
      );
      setNextUrl(categorias.next);
    }
  }, [categorias]);

  //Si existe una subcategoría con categoría asignada, seleccionarla automáticamente
  useEffect(() => {
    if (subcategorias?.categoria_id && options.length > 0) {
      const found = options.find((opt) => opt.value == subcategorias.categoria_id);
      if (found) setSelectedOption(found);
    }else{
        setSelectedOption(null);
    }
  }, [subcategorias, options]);

  //Cargar más categorías (paginación)
  const handleLoadMore = () => {
    if (nextUrl) {
      const pageParam = new URL(nextUrl).searchParams.get("page");
      dispatch(getAllCategorias({ page: pageParam }));
    }
  };

  //Menú con opción "Ver más..."
  const MenuList = (props) => (
    <>
      {props.children}
      {nextUrl && (
        <div
          onClick={handleLoadMore}
          style={{
            textAlign: "center",
            padding: "8px",
            cursor: "pointer",
            color: "#1976d2",
            fontWeight: "bold",
            borderTop: "1px solid #ddd",
          }}
        >
          Ver más...
        </div>
      )}
    </>
  );

  //Cuando el usuario selecciona una categoría
  const handleChangeSelect = (selected) => {
    setSelectedOption(selected);

    // Guardar id de categoría en el store de subcategoría
    dispatch(
      handleFormStoreThunk({
        name: "categoria_id",
        value: selected?.value || null,
      })
    );
  };

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={handleChangeSelect}
      placeholder="Seleccione una categoría"
      components={{ MenuList }}
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        menuList: (base) => ({
          ...base,
          maxHeight: "200px",
          overflowY: "auto",
        }),
      }}
    />
  );
};
