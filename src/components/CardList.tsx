/* eslint-disable prettier/prettier */
import { Flex, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imgUrl, setImgUrl] = useState('');

  function handleViewImage(img: string): void {
    setImgUrl(img);
    onOpen();
  }

  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={['40px', '40px', '40px']}>
      {cards.map(card => {
        return (
          <Flex direction="column" key={card.id} h="100%" w="100%" minW="295">
            <Card data={card} viewImage={() => handleViewImage(card.url)} />

            <ModalViewImage isOpen={isOpen} onClose={onClose} imgUrl={imgUrl} />
          </Flex>
        );
      })}
    </SimpleGrid>
  );
}
