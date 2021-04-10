export type CardItem = {
  id: number;
  title: string;
  description: string;
  status: string;
};

export type DragableCardItem = CardItem & {
  index: number;
};
