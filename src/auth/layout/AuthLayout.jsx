import { Grid, Typography } from '@mui/material';

// ** RUTA DE LA IMAGEN DE FONDO **
//
// 1. Si tu imagen está en la carpeta 'public' (o 'assets') y es accesible por URL:
const backgroundImage = '/pos/perfume.jpg';

// 2. Si estás usando un bundler como Webpack/Vite y la imagen está dentro de 'src',
//    debes importarla (descomenta las dos líneas siguientes y usa 'perfumeImage'):
// import perfumeImage from '../assets/images/pos/perfume.jpg';
// const backgroundImage = perfumeImage; 


// Se ha cambiado a 'export default function' para evitar el error "Element type is invalid"
export const AuthLayout = ({ children, title = '' }) => {
  
  return (
    
    <Grid
      container
      spacing={ 0 }
      direction="column"
      alignItems="center"
      justifyContent="center"
      // Estilos para la imagen de fondo en el contenedor principal
      sx={{ 
          minHeight: '100vh', 
          padding: 4,
          // 1. Establecer la imagen de fondo
          backgroundImage: `url(${ backgroundImage })`,
          // 2. Cubrir todo el contenedor sin repetir (clave para lo que solicitaste)
          backgroundSize: 'cover',
          // 3. Evitar que la imagen se repita
          backgroundRepeat: 'no-repeat',
          // 4. Centrar la imagen
          backgroundPosition: 'center',
      }}
    >

      {/* Grid que contiene el formulario (la caja blanca) */}
      <Grid item
        className='box-shadow'
        // Se sugiere quitar 'xs={3}' ya que el width ya está definido para pantallas pequeñas.
        // xs={ 3 } 
        sx={{ 
             width: { sm: 450 },
             backgroundColor: 'white', // Fondo blanco para que el contenido resalte
             padding: 3, 
             borderRadius: 2,
             // Sombra sutil para destacarlo sobre la imagen de fondo
             boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.2)'
        }}>
          
          <Typography variant='h5' sx={{ mb: 1 }}>{ title }</Typography>

            
            { children } {/* Contenido del formulario o la vista de autenticación */}

        </Grid>

    </Grid>

  )
}