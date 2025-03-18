import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Stats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  urlId: number;

  @Column()
  clicks: number;

  @Column()
  browser: string;

  @Column()
  location: string;
}