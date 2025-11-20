import { useState, useEffect } from "react";
import { Button, Grid,  TextField } from '@mui/material';
import { AuthLayout } from '../layout/AuthLayout';
import { useDispatch } from 'react-redux'
import { getAuth }     from '../../store/authStore/authThunks';
import { SimpleBackdrop } from "../../components/Backdrop/BackDrop";
import { useSelector } from "react-redux";
import { handleFormStoreThunk } from "../../store/authStore/authThunks";

export const LoginPage = () => {
  //const { alert }              = useSelector( state => state.globalStore 
  // );
  const { username, password } = useSelector( state => state.authStore );
  const [errors,    setErrors] = useState({ username: '', password: '' });

  const dispatch = useDispatch()
  
  const validate = () => {
    let tempErrors = { username: '', password: '' };
    let isValid = true;

    if (!username) {
      tempErrors.username = 'El username es requerido';
      isValid = false;
    }

    if (!password) {
      tempErrors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch( getAuth(username, password) );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log( name, value )
    dispatch( handleFormStoreThunk({ name, value }) );
  }

  return (
    <AuthLayout title="Login">

      <form onSubmit={handleSubmit}>
          <Grid container>
            <Grid item xs={ 12 } sx={{ mt: 2 }}>
              <TextField 
                label="Usuario" 
                type="text"
                name="username"
                placeholder='usuario' 
                fullWidth                
                error={Boolean(errors.username)}
                helperText={errors.username}
                value={username}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={ 12 } sx={{ mt: 2 }}>
              <TextField 
                label="Contraseña" 
                type="password" 
                name="password"
                placeholder='Contraseña' 
                fullWidth
                error={Boolean(errors.password)}
                helperText={errors.password}
                value={password}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid container spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
              <Grid item xs={ 12 } sm={ 12 }>
                <Button type="submit" variant="contained" fullWidth>
                  Login
                </Button>
              </Grid>
            </Grid>

          </Grid>
        </form>

      <SimpleBackdrop />

    
    </AuthLayout>
  )
}