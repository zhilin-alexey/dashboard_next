"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SortingHeader from "@/components/ui/sorting-header";
import { ColumnDef } from "@tanstack/react-table";
import { changeStatus } from "../lib/actions/change-status";

export type Client = {
  id: string;
  accountNumber: number;
  birthdayDate: Date;
  inn: number;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  accountableFullName: string;
};

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "id",
    header: SortingHeader("ID"),
  },
  {
    accessorKey: "account_number",
    header: SortingHeader("Номер счета"),
  },
  {
    accessorKey: "birthday_date",
    header: SortingHeader("День рождения"),
  },
  {
    accessorKey: "inn",
    header: SortingHeader("ИНН"),
  },
  {
    accessorKey: "status",
    header: SortingHeader("Статус"),
    cell: ({ getValue, row }) => {
      const id = row.original.id;
      let status = getValue<string>();
      return (
        <Select
          value={status}
          key={status}
          onValueChange={async (value: string) => {
            await changeStatus(id, value);
            status = value;
          }}
        >
          <SelectTrigger className="w-max">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="IN WORK">В работе</SelectItem>
            <SelectItem value="REJECTED">Отказ</SelectItem>
            <SelectItem value="DEAL_CLOSED">Сделка закрыта</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "accountable_full_name",
    header: SortingHeader("Ответственное лицо"),
  },
];
