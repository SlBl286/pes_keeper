"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateTourDialog } from "@/hooks/use-create-tour-dialog";
import {
  getTournamentSchema,
  TournamentSchemaType,
  TournamentTypeEnum,
} from "@/types/tournament";
import { Plus, Trophy } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/combobox";
export const Header = () => {
  const form = useForm<TournamentSchemaType>({
    resolver: zodResolver(getTournamentSchema()),
    defaultValues: {
      name: "",
      type: "knockout",
      rounds: 1,
      created_at: new Date(),
    },
  });
  async function onSubmit(values: TournamentSchemaType) {}
  const { isOpen, setIsOpen } = useCreateTourDialog();
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl">
                <Trophy className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-balance">
                  Quản lý giải đấu
                </h1>
                <p className="text-muted-foreground">
                  Quản lý và theo dõi các giải đấu đã tạo
                </p>
              </div>
            </div>
          </div>
          <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <DialogTrigger asChild>
              <Button
                className="flex items-center gap-2 hover:cursor-pointer"
                type="button"
              >
                <Plus className="w-4 h-4" />
                Tạo gải đấu
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Tạo giải đấu mới
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full grid grid-cols-1 gap-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full col-span-1 md:col-span-2 lg:col-span-4">
                        <FormLabel>Tên giải đấu</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Tên giải đấu" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="w-full col-span-1 md:col-span-2 lg:col-span-4">
                        <FormLabel>Loại giải đấu</FormLabel>
                        <FormControl>
                          <Combobox
                            multi={false}
                            placeholder="Chọn loại giải"
                            data={[
                              {
                                value: 0,
                                label: "Loại trực tiếp",
                              },
                              {
                                value: 1,
                                label: "Vòng tròn tính điểm",
                              },
                            ]}
                            value={field.value === "knockout" ? 0 : 1}
                            onChange={(v) => {
                              if (v === 0) {
                                field.onChange("knockout");
                              } else {
                                field.onChange("round");
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rounds"
                    render={({ field }) => (
                      <FormItem className="w-full col-span-1 md:col-span-2 lg:col-span-4">
                        <FormLabel>Số vòng</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Số vòng" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};
