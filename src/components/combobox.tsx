'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button, ButtonArrow } from '@/components/ui/button';
import {
  Command,
  CommandCheck,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface ComboboxItem {
  value: number;
  label: string;
  icon?: string;
  subLabel?: string;
}

interface ComboboxProps {
  data: ComboboxItem[];
  multi: boolean;
  placeholder: string;
  onChange: (value?: number | number[]) => void;
  value?: number | number[] | null;
  name?: string;
  inputRef?: React.Ref<any>; // optional ref for RHF
  readonly?: boolean;
}
export function Combobox({
  data,
  placeholder,
  onChange,
  value,
  multi = false,
  readonly = false,
}: ComboboxProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [visibleData, setVisibleData] = React.useState<ComboboxItem[]>([]);
  const [page, setPage] = React.useState(1);
  const pageSize = 10;
  React.useEffect(() => {
    setVisibleData(data.slice(0, pageSize));
    setPage(1);
  }, [data, open]);
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(
      (item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subLabel?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  // Reset khi searchTerm hoặc data đổi
  React.useEffect(() => {
    setVisibleData(filteredData.slice(0, pageSize));
  }, [filteredData]);
  const loadMore = React.useCallback(() => {
    const nextPage = page + 1;
    const newData = data.slice(0, nextPage * pageSize);
    setVisibleData(newData);
    setPage(nextPage);
  }, [page, data]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    console.log(target.scrollTop);
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 50) {
      // Gần chạm đáy -> load thêm
      if (visibleData.length < data.length) {
        loadMore();
      }
    }
  };
  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        if (!readonly) setOpen(o);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          aria-readonly={readonly}
          variant="outline"
          role="combobox"
          mode="input"
          placeholder={!!placeholder}
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2.5 truncate">
            {value != undefined ? (
              <>
                <span
                  className="w-20"
                  hidden={!data.find((item) => item.value === value)?.icon}
                >
                  <img src={data.find((item) => item.value === value)?.icon} />
                </span>
                {multi ? (
                  <div className="flex flex-wrap gap-1 p-1">
                    {Array.isArray(value) && value.length > 0
                      ? (value as number[]).map((v) => {
                          const label = data.find(
                            (item) => item.value === v,
                          )?.label;
                          return (
                            <span
                              key={v}
                              className="text-sm bg-muted px-2 py-0.5 rounded-md text-foreground"
                            >
                              {label}
                            </span>
                          );
                        })
                      : placeholder}
                  </div>
                ) : (
                  <>
                    {' '}
                    <span className="text-foreground ms-1">
                      {data.find((item) => item.value === value)?.label}
                    </span>
                  </>
                )}
              </>
            ) : (
              <>{placeholder}</>
            )}
          </span>
          {multi ? (
            Array.isArray(value) && value.length > 0 && !readonly ? (
              <div
                className=" relative -end-3.5 top-1 h-6 w-6"
                onClick={(e) => {
                  e.preventDefault();
                  onChange(undefined);
                }}
              >
                <X />
              </div>
            ) : (
              <ButtonArrow />
            )
          ) : value && !readonly ? (
            <div
              className=" relative -end-3.5 top-1 h-6 w-6"
              onClick={(e) => {
                e.preventDefault();
                onChange(undefined);
              }}
            >
              <X />
            </div>
          ) : (
            <ButtonArrow />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onValueChange={(val) => setSearchTerm(val)}
          />
          <CommandList>
            <ScrollArea
              viewportClassName="max-h-[300px] [&>div]:block! "
              onViewportScroll={handleScroll}
            >
              <CommandEmpty>Không thấy dự liệu nào</CommandEmpty>
              <CommandGroup>
                {visibleData.map((item) => (
                  <CommandItem
                    className="w-full"
                    key={item.value}
                    value={item.subLabel + ' ' + item.label}
                    onSelect={(_) => {
                      if (multi) {
                        const currentValues = Array.isArray(value) ? value : [];

                        const isSelected = currentValues.includes(item.value);

                        let newValues: number[] | undefined;

                        if (isSelected) {
                          newValues = currentValues.filter(
                            (v) => v !== item.value,
                          );
                          if (newValues.length === 0) newValues = undefined;
                        } else {
                          newValues = [...currentValues, item.value];
                        }

                        onChange(newValues);
                      } else {
                        onChange(item.value);
                        setOpen(false);
                      }
                    }}
                  >
                    <span className="flex items-center gap-2.5 truncate  w-full">
                      <span className="w-20 max-h-10" hidden={!item.icon}>
                        <img src={item.icon} />
                      </span>
                      <span className="me-1" hidden={!!item.icon}>
                        {item.subLabel}
                      </span>
                      {item.label}
                    </span>
                    {!!multi && value != undefined
                      ? (value as number[]).includes(item.value) && (
                          <CommandCheck />
                        )
                      : value === item.value && <CommandCheck />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
