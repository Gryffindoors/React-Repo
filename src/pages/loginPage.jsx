// src/pages/LoginPage.jsx
import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Background from '../layouts/background';
import toast from 'react-hot-toast';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router';

// Validation schema
const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username required'),
  password: Yup.string().min(4, 'Too short').required('Password required'),
});

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  return (

    <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)]">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
          Login
        </h2>

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await login(values.username, values.password);
              toast.success(`Welcome, ${values.username}`);
              // ❌ remove navigate('/') from here
            } catch (err) {
              toast.error(err.message || 'Login failed');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <label className="block text-sm mb-1">Username</label>
                <Field
                  type="text"
                  name="username"
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Password</label>
                <Field
                  type="password"
                  name="password"
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>

  );
}
