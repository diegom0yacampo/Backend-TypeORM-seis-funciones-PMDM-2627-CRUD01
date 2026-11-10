import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Granja } from "../../granja/entities/granja.entity";

@Entity({ name: "COSECHA" })
export class Cosecha {
  @PrimaryGeneratedColumn({ name: "ID" })
  id!: number;

  @Column({ name: "NOMBRE", type: "varchar", length: 120 })
  nombre!: string;

  @Column({ name: "KILOS", type: "integer" })
  kilos!: number;

  @ManyToOne(() => Granja, (granja) => granja.cosechas, { nullable: false })
  @JoinColumn({ name: "ID_GRANJA" })
  granja!: Granja;
}
