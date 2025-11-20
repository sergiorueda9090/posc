

import React, { useState } from "react";
import { Paper, InputBase, IconButton, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import { getAllThunks } from "../../store/subcategoriaStore/subcategoriaThunks";
import { searchQueryGlobalStore, showAlert } from "../../store/globalStore/globalStore";

export const SearchQuery = () => {
    
    const dispatch = useDispatch();

    let { startDate, endDate, searchQuery } = useSelector(state => state.globalStore);
    
    const handleSearch = () => {

        if(!searchQuery){
            dispatch(
                showAlert({
                    type: "error",
                    title: "Error al Buscar",
                    text: "Debes escribir algo en el buscador para buscar.",
                })
            );
            return;
        }

        dispatch(getAllThunks({ page: 1, search: searchQuery, start_date: startDate, end_date: endDate }));
    };

    const handleClear = () => {

        dispatch(searchQueryGlobalStore({'searchQuery':''}) )
        dispatch(getAllThunks());
        
    };

    return (
        <Paper
            component="form"
            sx={{ 
                p: "1px 3px", 
                display: "flex", 
                alignItems: "center", 
                width: 400 
            }}
            onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
            }}
            size="small"
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Buscar..."
                inputProps={{ "aria-label": "buscar" }}
                value={searchQuery}
                onChange={(e) => dispatch(searchQueryGlobalStore({ searchQuery: e.target.value }))}
                size="small"
            />
            
            {/* Botón de Búsqueda */}
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search" onClick={handleSearch}>
                <SearchIcon />
            </IconButton>

            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

            {/* Botón para Limpiar la Búsqueda */}
            <IconButton type="button" sx={{ p: "10px" }} aria-label="clear" onClick={handleClear}>
                <ClearIcon />
            </IconButton>
        </Paper>
    );
};

