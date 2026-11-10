import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Granja } from "../granja/entities/granja.entity";
import { Cosecha } from "./entities/cosecha.entity";
import { CosechaController } from "./cosecha.controller";
import { CosechaService } from "./cosecha.service";

@Module({
  imports: [TypeOrmModule.forFeature([Granja, Cosecha])],
  controllers: [CosechaController],
  providers: [CosechaService],
})
export class CosechaModule {}
