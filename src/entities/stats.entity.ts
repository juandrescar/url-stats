import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Stats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  urlId: number;

  @Column()
  browser: string;

  @Column()
  location: string;

  @CreateDateColumn()
  createdAt: Date;
}