import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { CosechaService } from "./cosecha.service";
import type { CambiarGranjaDto, CrearCosechaDto, ModificarCosechaDto } from "./cosecha.dto";

@Controller("cosechas")
export class CosechaController {
  constructor(private readonly cosechaService: CosechaService) {}

  @Post()
  crear(@Body() body: CrearCosechaDto) {
    return this.cosechaService.crear(body);
  }

  @Get()
  listar() {
    return this.cosechaService.listar();
  }

  // 6. INNER JOIN + WHERE → GET /cosechas/granja/1
  @Get("granja/:granjaId")
  buscarPorGranja(@Param("granjaId", ParseIntPipe) granjaId: number) {
    return this.cosechaService.buscarPorGranja(granjaId);
  }

  // 5. Modificar la FK → PATCH /cosechas/3/granja
  // (va antes que PATCH :id para que la ruta general no oculte la específica)
  @Patch(":id/granja")
  cambiarGranja(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: CambiarGranjaDto,
  ) {
    return this.cosechaService.cambiarGranja(id, body?.granjaId);
  }

  @Patch(":id")
  modificar(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: ModificarCosechaDto,
  ) {
    return this.cosechaService.modificar(id, body);
  }

  @Delete(":id")
  eliminar(@Param("id", ParseIntPipe) id: number) {
    return this.cosechaService.eliminar(id);
  }
}
