import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Granja } from "../granja/entities/granja.entity";
import { Cosecha } from "./entities/cosecha.entity";
import type { CrearCosechaDto, ModificarCosechaDto } from "./cosecha.dto";

@Injectable()
export class CosechaService {
  constructor(
    @InjectRepository(Cosecha)
    private readonly cosechaRepository: Repository<Cosecha>,
    @InjectRepository(Granja)
    private readonly granjaRepository: Repository<Granja>,
  ) {}

  async crear(datos: CrearCosechaDto) {
    const nombre = this.validarNombre(datos?.nombre);
    const kilos = this.validarKilos(datos?.kilos);
    const granjaId = this.validarId(datos?.granjaId, "granjaId");
    await this.comprobarGranja(granjaId);

    const resultado = await this.cosechaRepository
      .createQueryBuilder()
      .insert()
      .into(Cosecha)
      .values({ nombre, kilos, granja: { id: granjaId } })
      .execute();

    return this.buscarPorId(resultado.identifiers[0].id);
  }

  listar() {
    return this.cosechaRepository.find({
      relations: { granja: true },
      order: { id: "ASC" },
    });
  }

  async eliminar(id: number) {
    const cosecha = await this.buscarPorId(id);

    const resultado = await this.cosechaRepository
      .createQueryBuilder()
      .delete()
      .from(Cosecha)
      .where({ id })
      .execute();

    return { eliminada: cosecha, filasAfectadas: resultado.affected };
  }

  async modificar(id: number, datos: ModificarCosechaDto) {
    const cambios: Partial<Pick<Cosecha, "nombre" | "kilos">> = {};
    if (datos?.nombre !== undefined) cambios.nombre = this.validarNombre(datos.nombre);
    if (datos?.kilos !== undefined) cambios.kilos = this.validarKilos(datos.kilos);
    if (Object.keys(cambios).length === 0) {
      throw new BadRequestException("Envía al menos un campo para modificar: nombre o kilos");
    }

    await this.buscarPorId(id);

    await this.cosechaRepository
      .createQueryBuilder()
      .update(Cosecha)
      .set(cambios)
      .where({ id })
      .execute();

    return this.buscarPorId(id);
  }

  //Modificar la clave foránea (ID_GRANJA)
  async cambiarGranja(id: number, granjaIdRecibido: number) {
    const granjaId = this.validarId(granjaIdRecibido, "granjaId");
    await this.buscarPorId(id);
    await this.comprobarGranja(granjaId);

    await this.cosechaRepository
      .createQueryBuilder()
      .update(Cosecha)
      .set({ granja: { id: granjaId } })
      .where({ id })
      .execute();

    return this.buscarPorId(id);
  }

  //INNER JOIN + WHERE
  buscarPorGranja(granjaId: number) {
    return this.cosechaRepository
      .createQueryBuilder("cosecha")
      .innerJoinAndSelect("cosecha.granja", "granja")
      .where("granja.id = :granjaId", { granjaId })
      .orderBy("cosecha.id", "ASC")
      .getMany();
  }

  //Apoyo y validaciones
  private async buscarPorId(id: number) {
    const cosecha = await this.cosechaRepository.findOne({
      where: { id },
      relations: { granja: true },
    });
    if (!cosecha) {
      throw new NotFoundException(`No existe la cosecha con ID ${id}`);
    }
    return cosecha;
  }

  private async comprobarGranja(granjaId: number) {
    const existe = await this.granjaRepository.exists({ where: { id: granjaId } });
    if (!existe) {
      throw new NotFoundException(`No existe la granja con ID ${granjaId}`);
    }
  }

  private validarNombre(nombre: unknown) {
    if (typeof nombre !== "string" || nombre.trim() === "") {
      throw new BadRequestException("nombre debe ser un texto no vacío");
    }
    if (nombre.trim().length > 120) {
      throw new BadRequestException("nombre admite como máximo 120 caracteres");
    }
    return nombre.trim();
  }

  private validarKilos(kilos: unknown) {
    if (typeof kilos !== "number" || !Number.isInteger(kilos) || kilos < 0) {
      throw new BadRequestException("kilos debe ser un número entero mayor o igual que 0");
    }
    return kilos;
  }

  private validarId(valor: unknown, campo: string) {
    if (typeof valor !== "number" || !Number.isInteger(valor) || valor <= 0) {
      throw new BadRequestException(`${campo} debe ser un número entero positivo`);
    }
    return valor;
  }
}
