/* eslint-disable no-unused-expressions */
/* eslint-disable prettier/prettier */
import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

interface ImageFormData {
  url: string;
  title: string;
  description: string;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: {
        value: true,
        message: 'Required image',
      },
      validate: {
        lessThan10MB: file => file[0]?.size < 10000000 || 'File max size: 10MB',
        acceptedFormats: file =>
          ['image/jpeg', 'image/png', 'image/gif'].includes(file[0]?.type) ||
          'Accepting only PNG, JPEG e GIF',
      },
    },
    title: {
      required: {
        value: true,
        message: 'Required title',
      },
      minLength: {
        value: 2,
        message: 'Min characters accepted: 2.',
      },
      maxLength: {
        value: 20,
        message: 'Max characters accepted: 20.',
      },
    },
    description: {
      required: {
        value: true,
        message: 'Required description.',
      },
      maxLength: {
        value: 65,
        message: 'Max characters accepted: 65.',
      },
    },
  };

  const queryClient = useQueryClient();
  const addImage = useMutation(
    async (data: ImageFormData) => {
      const response = await api.post('api/images', {
        url: imageUrl,
        title: data.title,
        description: data.description,
      });
      return response.data;
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit: SubmitHandler<ImageFormData> = async data => {
    try {
      !imageUrl
        ? toast({
            title: 'Image not uploaded successfully',
            description: 'Needed wait image be uploaded.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        : await addImage.mutateAsync(data);

      toast({
        title: 'Image uploaded successfully',
        description: 'Your image got upload successfully.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Image upload failed',
        description: 'Something went wrong uploading your image.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      reset();
      setImageUrl(null);
      setLocalImageUrl(null);
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title}
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
