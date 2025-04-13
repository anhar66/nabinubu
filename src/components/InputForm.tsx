import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Saran untuk Pengembangan Form Input:
 *
 * 1. Fitur Pencarian dan Filter: Tambahkan dropdown filter untuk mencari transaksi sebelumnya
 *    dan mengisi form dengan data yang sudah ada untuk memudahkan entri data berulang dan
 *    menjaga konsistensi data.
 *
 * 2. Fitur Foto Bukti: Tambahkan input file dengan preview untuk melampirkan foto bukti
 *    transaksi seperti struk atau invoice, dengan kompresi gambar otomatis.
 *
 * 3. Validasi Form: Tingkatkan validasi form dengan pesan error yang lebih spesifik,
 *    validasi real-time saat pengguna mengetik, dan highlight field yang memerlukan perhatian.
 *
 * 4. Template Transaksi: Tambahkan kemampuan untuk menyimpan dan mengelola template transaksi
 *    yang sering digunakan dengan nama yang dapat disesuaikan untuk mempercepat proses input data.
 *
 * 5. Auto-save: Implementasikan penyimpanan otomatis data form sebagai draft untuk mencegah
 *    kehilangan data jika pengguna meninggalkan halaman secara tidak sengaja.
 *
 * 6. Riwayat Input: Tampilkan riwayat input terbaru dengan opsi untuk menduplikasi atau
 *    mengedit transaksi yang sudah ada.
 */

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Car,
  Ship,
  Utensils,
  DollarSign,
  MapPin,
  Fuel,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createTransaction } from "@/services/transactionService";
import { useToast } from "@/components/ui/use-toast";

const InputForm = () => {
  const { toast } = useToast();
  const [assetType, setAssetType] = useState("car");
  const [rentalType, setRentalType] = useState("drop");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [vehicle, setVehicle] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [price, setPrice] = useState("");
  const [fuelCost, setFuelCost] = useState("");
  const [driverCost, setDriverCost] = useState("");
  const [trips, setTrips] = useState("1");
  const [days, setDays] = useState("1");
  const [salesAmount, setSalesAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cars = [
    { name: "Veloz 2021", plate: "B 2622 POI" },
    { name: "Veloz 2019", plate: "DR 1019 KG" },
    { name: "Avanza 2023", plate: "Z 1494 TQ" },
    { name: "Avanza 2022", plate: "B 2206 POT" },
    { name: "Avanza 2018", plate: "AB 1375 KJ" },
    { name: "Avanza 2019", plate: "B 2191 TIH" },
    { name: "Avanza 2023", plate: "D 1217 UBM" },
  ];

  const speedboats = [
    { name: "Speed Boat Broo Meet" },
    { name: "Speed Boat Bintang Laut" },
    { name: "Speed Boat BJT 01" },
    { name: "Speed Boat Speedy91" },
  ];

  const calculateDailyCash = () => {
    const tripsNum = parseInt(trips) || 0;
    const daysNum = parseInt(days) || 0;

    if (assetType === "car") {
      if (rentalType === "drop") {
        return tripsNum * 10000;
      } else {
        // harian
        return daysNum * 10000;
      }
    } else if (assetType === "speedboat") {
      return tripsNum * 10000; // 10,000 per trip for speedboat
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!date) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Tanggal harus diisi",
        });
        return;
      }

      const formattedDate = format(date, "yyyy-MM-dd");
      const dailyCash = calculateDailyCash();

      let transactionData: any = {
        date: formattedDate,
        assetType,
        dailyCash,
      };

      if (assetType === "car") {
        if (!vehicle || !price) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Semua field harus diisi",
          });
          return;
        }

        transactionData = {
          ...transactionData,
          assetName: vehicle,
          rentalType,
          price: parseFloat(price),
        };

        if (rentalType === "drop") {
          if (!fromLocation || !toLocation) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Lokasi awal dan tujuan harus diisi",
            });
            return;
          }
          transactionData = {
            ...transactionData,
            route: `${fromLocation} - ${toLocation}`,
            operationalCosts: {
              fuel: parseFloat(fuelCost) || 0,
              driver: parseFloat(driverCost) || 0,
            },
            trips: parseInt(trips),
          };
        } else {
          // harian
          transactionData = {
            ...transactionData,
            days: parseInt(days),
          };
        }
      } else if (assetType === "speedboat") {
        if (!vehicle || !trips || !price) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Semua field harus diisi",
          });
          return;
        }
        transactionData = {
          ...transactionData,
          assetName: vehicle,
          price: parseFloat(price),
          trips: parseInt(trips),
        };
      } else if (assetType === "restaurant") {
        if (!salesAmount) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Uang kas harian harus diisi",
          });
          return;
        }
        transactionData = {
          ...transactionData,
          assetName: "Resto",
          price: 0,
          dailyCash: parseFloat(salesAmount) || 0,
          trips: 1,
          days: 1,
        };
      }

      // Save to Supabase
      await createTransaction(transactionData);

      // Reset form
      setVehicle("");
      setFromLocation("");
      setToLocation("");
      setPrice("");
      setFuelCost("");
      setDriverCost("");
      setTrips("1");
      setDays("1");
      setSalesAmount("");

      toast({
        title: "Sukses",
        description: "Data berhasil disimpan!",
        variant: "default",
        className: "bg-green-100 border border-green-400 text-green-800",
      });

      // Redirect ke halaman laporan setelah menyimpan data
      setTimeout(() => {
        window.location.href = "/reports";
      }, 1500);
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menyimpan data. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full bg-bjt-background shadow-sm border-none max-w-3xl mx-auto">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="asset-type" className="text-bjt-textSecondary">
                Jenis Aset
              </Label>
              <div className="grid grid-cols-3 gap-2 mx-auto w-[110%] -ml-[5%]">
                <Button
                  type="button"
                  className={`bjt-btn flex items-center justify-center gap-2 ${assetType === "car" ? "bjt-btn-primary" : "bjt-btn-ghost bg-bjt-cardBg"}`}
                  onClick={() => setAssetType("car")}
                >
                  <Car className="h-4 w-4" />
                  <span>Mobil</span>
                </Button>
                <Button
                  type="button"
                  className={`bjt-btn flex items-center justify-center gap-2 ${assetType === "speedboat" ? "bjt-btn-primary" : "bjt-btn-ghost bg-bjt-cardBg"}`}
                  onClick={() => setAssetType("speedboat")}
                >
                  <Ship className="h-4 w-4" />
                  <span>Speedboat</span>
                </Button>
                <Button
                  type="button"
                  className={`bjt-btn flex items-center justify-center gap-2 ${assetType === "restaurant" ? "bjt-btn-primary" : "bjt-btn-ghost bg-bjt-cardBg"}`}
                  onClick={() => setAssetType("restaurant")}
                >
                  <Utensils className="h-4 w-4" />
                  <span>Resto</span>
                </Button>
              </div>
            </div>

            {assetType === "car" && (
              <div className="space-y-2">
                <Label htmlFor="rental-type" className="text-bjt-textSecondary">
                  Jenis Rental
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    className={`bjt-btn ${rentalType === "drop" ? "bjt-btn-primary" : "bjt-btn-ghost bg-bjt-cardBg"}`}
                    onClick={() => setRentalType("drop")}
                  >
                    Drop
                  </Button>
                  <Button
                    type="button"
                    className={`bjt-btn ${rentalType === "harian" ? "bjt-btn-primary" : "bjt-btn-ghost bg-bjt-cardBg"}`}
                    onClick={() => setRentalType("harian")}
                  >
                    Harian
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="date" className="text-bjt-textSecondary">
                Tanggal
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="bjt-input w-full justify-start text-left font-normal flex items-center"
                  >
                    <CalendarIcon className="mr-2 h-5 w-5 text-bjt-textSecondary" />
                    {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bjt-dropdown">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="rounded-bjt border border-bjt-inactive"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {(assetType === "car" || assetType === "speedboat") && (
              <div className="space-y-2">
                <Label htmlFor="vehicle" className="text-bjt-textSecondary">
                  {assetType === "car" ? "Mobil" : "Speedboat"}
                </Label>
                <Select value={vehicle} onValueChange={setVehicle}>
                  <SelectTrigger className="bjt-input h-12">
                    <SelectValue
                      placeholder={`Pilih ${assetType === "car" ? "mobil" : "speedboat"}`}
                    />
                  </SelectTrigger>
                  <SelectContent className="bjt-dropdown">
                    {assetType === "car"
                      ? cars.map((car, index) => (
                          <SelectItem
                            key={index}
                            value={`${car.name} (${car.plate})`}
                          >
                            {car.name} ({car.plate})
                          </SelectItem>
                        ))
                      : speedboats.map((boat, index) => (
                          <SelectItem key={index} value={boat.name}>
                            {boat.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Rest of the form remains the same */}
            {assetType === "car" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-bjt-textSecondary">
                    Harga Sewa (Rp)
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <DollarSign className="h-5 w-5 text-bjt-textSecondary" />
                    </div>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Masukkan harga sewa"
                      className="bjt-input pl-10 h-12"
                    />
                  </div>
                </div>

                {rentalType === "drop" ? (
                  <>
                    <div className="space-y-2">
                      <Label
                        htmlFor="from-location"
                        className="text-bjt-textSecondary"
                      >
                        Lokasi Awal
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MapPin className="h-5 w-5 text-bjt-textSecondary" />
                        </div>
                        <Input
                          id="from-location"
                          value={fromLocation}
                          onChange={(e) => setFromLocation(e.target.value)}
                          placeholder="Masukkan lokasi awal"
                          className="bjt-input pl-10 h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="to-location"
                        className="text-bjt-textSecondary"
                      >
                        Lokasi Tujuan
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MapPin className="h-5 w-5 text-bjt-textSecondary" />
                        </div>
                        <Input
                          id="to-location"
                          value={toLocation}
                          onChange={(e) => setToLocation(e.target.value)}
                          placeholder="Masukkan lokasi tujuan"
                          className="bjt-input pl-10 h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="fuel-cost"
                        className="text-bjt-textSecondary"
                      >
                        Biaya Bensin (Rp)
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Fuel className="h-5 w-5 text-bjt-textSecondary" />
                        </div>
                        <Input
                          id="fuel-cost"
                          type="number"
                          value={fuelCost}
                          onChange={(e) => setFuelCost(e.target.value)}
                          placeholder="Masukkan biaya bensin"
                          className="bjt-input pl-10 h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="driver-cost"
                        className="text-bjt-textSecondary"
                      >
                        Ongkos Sopir (Rp)
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Users className="h-5 w-5 text-bjt-textSecondary" />
                        </div>
                        <Input
                          id="driver-cost"
                          type="number"
                          value={driverCost}
                          onChange={(e) => setDriverCost(e.target.value)}
                          placeholder="Masukkan ongkos sopir"
                          className="bjt-input pl-10 h-12"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="days" className="text-bjt-textSecondary">
                      Jumlah Hari
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-bjt-textSecondary" />
                      </div>
                      <Input
                        id="days"
                        type="number"
                        min="1"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        placeholder="Masukkan jumlah hari"
                        className="bjt-input pl-10 h-12"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {((assetType === "car" && rentalType === "drop") ||
              assetType === "speedboat") && (
              <div className="space-y-2">
                <Label htmlFor="trips" className="text-bjt-textSecondary">
                  Jumlah Perjalanan
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-bjt-textSecondary" />
                  </div>
                  <Input
                    id="trips"
                    type="number"
                    min="1"
                    value={trips}
                    onChange={(e) => setTrips(e.target.value)}
                    placeholder="Masukkan jumlah perjalanan"
                    className="bjt-input pl-10 h-12"
                  />
                </div>
              </div>
            )}

            {assetType === "speedboat" && (
              <div className="space-y-2">
                <Label htmlFor="price" className="text-bjt-textSecondary">
                  Harga Sewa (Rp)
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <DollarSign className="h-5 w-5 text-bjt-textSecondary" />
                  </div>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Masukkan harga sewa"
                    className="bjt-input pl-10 h-12"
                  />
                </div>
              </div>
            )}

            {assetType === "restaurant" && (
              <div className="space-y-2">
                <Label
                  htmlFor="sales-amount"
                  className="text-bjt-textSecondary"
                >
                  Uang Kas Harian
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <DollarSign className="h-5 w-5 text-bjt-textSecondary" />
                  </div>
                  <Input
                    id="sales-amount"
                    type="number"
                    value={salesAmount}
                    onChange={(e) => setSalesAmount(e.target.value)}
                    placeholder="Masukkan jumlah uang kas"
                    className="bjt-input pl-10 h-12"
                  />
                </div>
              </div>
            )}

            {assetType !== "restaurant" && (
              <div className="bjt-info-card-info">
                <p className="text-sm font-medium">
                  Uang Kas: Rp{calculateDailyCash().toLocaleString()}
                </p>
                <p className="text-xs mt-1">
                  {assetType === "car" &&
                    rentalType === "drop" &&
                    "Rp10.000 per perjalanan"}
                  {assetType === "car" &&
                    rentalType === "harian" &&
                    "Rp10.000 per hari"}
                  {assetType === "speedboat" && "Rp10.000 per perjalanan"}
                </p>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="bjt-btn-primary w-[90%] mx-auto block h-12"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Data"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InputForm;
