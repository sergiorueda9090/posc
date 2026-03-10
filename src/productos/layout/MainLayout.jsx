import React from 'react';
import { ResponsiveLayout } from '../../components/ResponsiveLayout';

export const MainLayout = ({ children }) => (
  <ResponsiveLayout nameModule="Productos">{children}</ResponsiveLayout>
);
