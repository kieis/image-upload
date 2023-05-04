/* eslint-disable prettier/prettier */
import { Button, Box, Flex } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const responseGetImages = async ({ pageParam = null }) => {
    const response = await api.get('/api/images', {
      params: {
        after: pageParam,
      },
    });
    return response.data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', responseGetImages, {
    getNextPageParam: lastPage => {
      return lastPage.after ?? null;
    },
  });

  const formattedData = useMemo(() => {
    if (data) {
      return data.pages
        .map(page => {
          return page.data;
        })
        .flat();
    }
    return [];
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        <Flex>
          {hasNextPage && (
            <Button mt="10" onClick={() => fetchNextPage()}>
              {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
            </Button>
          )}
        </Flex>
      </Box>
    </>
  );
}
