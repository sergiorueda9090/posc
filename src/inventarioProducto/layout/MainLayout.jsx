import React from 'react';
import { ResponsiveLayout } from '../../components/ResponsiveLayout';

export const MainLayout = ({ children }) => (
  <ResponsiveLayout nameModule="Inventario de Productos">{children}</ResponsiveLayout>
);
