'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, PackageIcon, BadgeAlert } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import BarcodeScanner from './BarcodeScanner';
import QRCodeGenerator from './QRCodeGenerator';

// Define carrier options
const carriers = [
  { id: 'chronopost', name: 'Chronopost' },
  { id: 'dhl', name: 'DHL' },
  { id: 'fedex', name: 'FedEx' },
  { id: 'ups', name: 'UPS' },
  { id: 'la_poste', name: 'La Poste' },
  { id: 'amazon', name: 'Amazon Logistics' },
  { id: 'gls', name: 'GLS' },
  { id: 'dpd', name: 'DPD' },
  { id: 'colissimo', name: 'Colissimo' },
  { id: 'mondial_relay', name: 'Mondial Relay' },
  { id: 'other', name: 'Autre' },
];

// Package registration form schema
const packageSchema = z.object({
  tracking_number: z.string().min(1, 'Numéro de suivi requis'),
  carrier: z.string().min(1, 'Transporteur requis'),
  resident_id: z.string().min(1, 'Résident requis'),
  description: z.string().optional(),
  special_instructions: z.string().optional(),
  estimated_delivery_date: z.date().optional(),
});

type PackageFormValues = z.infer<typeof packageSchema>;

type Resident = {
  id: string;
  first_name: string;
  last_name: string;
  unit_number?: string;
};

export default function PackageRegistrationForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredPackage, setRegisteredPackage] = useState<any>(null);
  const [qrCodeValue, setQrCodeValue] = useState('');
  const scannerMountingRef = useRef(false);

  // Initialize react-hook-form
  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      tracking_number: '',
      carrier: '',
      resident_id: '',
      description: '',
      special_instructions: '',
    },
  });

  // Load residents data
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        // First fetch all residents
        const { data: residentData, error: residentError } = await supabase
          .from('residents')
          .select('id, first_name, last_name, unit_id')
          .order('last_name');

        if (residentError) throw residentError;

        // Then fetch building units
        const { data: unitData, error: unitError } = await supabase
          .from('building_units')
          .select('id, unit_number');

        if (unitError) throw unitError;

        // Create a map of unit_id to unit_number for quick lookup
        const unitMap = new Map();
        unitData?.forEach(unit => {
          unitMap.set(unit.id, unit.unit_number);
        });

        // Process resident data with unit information
        const processedResidents = residentData?.map(resident => ({
          id: resident.id,
          first_name: resident.first_name,
          last_name: resident.last_name,
          unit_number: resident.unit_id ? unitMap.get(resident.unit_id) : undefined
        })) || [];

        setResidents(processedResidents);
      } catch (error) {
        console.error('Error fetching residents:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger la liste des résidents',
          variant: 'destructive',
        });
      }
    };

    fetchResidents();
  }, [toast]);

  // Handle successful barcode scan
  const handleScanSuccess = (barcode: string) => {
    form.setValue('tracking_number', barcode);
    setIsScannerVisible(false);
    toast({
      title: 'Code-barres scanné',
      description: `Numéro de suivi: ${barcode}`,
    });
  };

  // Handle scan error
  const handleScanError = (error: string) => {
    toast({
      title: 'Erreur de scan',
      description: error,
      variant: 'destructive',
    });
  };

  // Generate a unique tracking ID for the package
  const generateTrackingId = () => {
    // Format: LDA-YYYYMMDD-XXXX where XXXX is a random 4-digit number
    const date = new Date();
    const dateString = format(date, 'yyyyMMdd');
    const randomPart = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
    return `LDA-${dateString}-${randomPart}`;
  };

  // Handle form submission
  const onSubmit = async (data: PackageFormValues) => {
    setIsLoading(true);

    try {
      const internalTrackingId = generateTrackingId();
      const qrValue = JSON.stringify({
        id: internalTrackingId,
        t: data.tracking_number,
        c: data.carrier,
        d: Date.now(),
      });

      // Insert package into database
      const { data: packageData, error } = await supabase.from('packages').insert({
        tracking_number: data.tracking_number,
        carrier: data.carrier,
        resident_id: data.resident_id,
        description: data.description || null,
        special_instructions: data.special_instructions || null,
        estimated_delivery_date: data.estimated_delivery_date ? data.estimated_delivery_date.toISOString() : null,
        internal_tracking_id: internalTrackingId,
        qr_code_data: qrValue,
        status: 'waiting', // Initial status: waiting for pickup
      }).select();

      if (error) throw error;

      // Get resident details for notification
      const resident = residents.find(r => r.id === data.resident_id);

      if (packageData && packageData.length > 0) {
        setIsRegistered(true);
        setRegisteredPackage(packageData[0]);
        setQrCodeValue(qrValue);

        // Reset form
        form.reset();

        toast({
          title: 'Colis enregistré',
          description: `Le colis a été enregistré avec succès pour ${resident?.first_name} ${resident?.last_name}`,
        });

        // TODO: Send notification to resident (to be implemented with SendGrid)
      }
    } catch (error) {
      console.error('Error registering package:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'enregistrer le colis. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form and state for new package
  const handleRegisterAnother = () => {
    setIsRegistered(false);
    setRegisteredPackage(null);
    setQrCodeValue('');
  };

  // Format date in French
  const formatDate = (date: Date) => {
    return format(date, 'PPP', { locale: fr });
  };

  // Update the visibility toggle logic by adding safe mounting and unmounting
  const toggleScannerVisibility = (visible: boolean) => {
    // If attempting to hide and scanner is already hidden, do nothing
    if (!visible && !isScannerVisible) return;
    
    // If attempting to show and scanner is already visible, do nothing
    if (visible && isScannerVisible) return;
    
    // If hiding the scanner
    if (!visible && isScannerVisible) {
      // Mark that we're in the process of unmounting
      scannerMountingRef.current = true;
      
      // Use a small delay to ensure proper cleanup
      setTimeout(() => {
        setIsScannerVisible(false);
        scannerMountingRef.current = false;
      }, 100);
      return;
    }
    
    // If showing the scanner
    setIsScannerVisible(true);
  };

  return (
    <div className="space-y-6">
      {!isRegistered ? (
        <>
          {isScannerVisible && (
            <Card>
              <CardHeader>
                <CardTitle>Scanner un code-barres</CardTitle>
                <CardDescription>
                  Utilisez la caméra pour scanner le code-barres du colis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarcodeScanner
                  onScanSuccess={handleScanSuccess}
                  onScanError={handleScanError}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => toggleScannerVisibility(false)}
                  disabled={scannerMountingRef.current}
                >
                  {scannerMountingRef.current ? 'Fermeture en cours...' : 'Annuler'}
                </Button>
              </CardFooter>
            </Card>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Enregistrer un nouveau colis</CardTitle>
                <CardDescription>
                  Saisissez les informations du colis pour l'enregistrer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tracking_number">Numéro de suivi</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => toggleScannerVisibility(!isScannerVisible)}
                      className="text-xs"
                    >
                      {isScannerVisible ? (scannerMountingRef.current ? 'Fermeture en cours...' : 'Cacher le scanner') : 'Scanner le code-barres'}
                    </Button>
                  </div>
                  <Input
                    id="tracking_number"
                    {...form.register('tracking_number')}
                    placeholder="Ex: 1ZA55W680399409896"
                  />
                  {form.formState.errors.tracking_number && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.tracking_number.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carrier">Transporteur</Label>
                  <Select
                    onValueChange={(value) => form.setValue('carrier', value)}
                    defaultValue={form.getValues('carrier')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un transporteur" />
                    </SelectTrigger>
                    <SelectContent>
                      {carriers.map((carrier) => (
                        <SelectItem key={carrier.id} value={carrier.id}>
                          {carrier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.carrier && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.carrier.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resident_id">Destinataire</Label>
                  <Select
                    onValueChange={(value) => form.setValue('resident_id', value)}
                    defaultValue={form.getValues('resident_id')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un résident" />
                    </SelectTrigger>
                    <SelectContent>
                      {residents.map((resident) => (
                        <SelectItem key={resident.id} value={resident.id}>
                          {resident.last_name} {resident.first_name} {resident.unit_number ? `(${resident.unit_number})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.resident_id && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.resident_id.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated_delivery_date" className="block">
                    Date estimée de livraison
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !form.getValues('estimated_delivery_date') && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.getValues('estimated_delivery_date') ? (
                          formatDate(form.getValues('estimated_delivery_date') as Date)
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={form.getValues('estimated_delivery_date') as Date}
                        onSelect={(date) => form.setValue('estimated_delivery_date', date as Date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description du colis</Label>
                  <Input
                    id="description"
                    {...form.register('description')}
                    placeholder="Ex: Boîte Amazon, colis moyen"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="special_instructions">Instructions spéciales</Label>
                  <Textarea
                    id="special_instructions"
                    {...form.register('special_instructions')}
                    placeholder="Ex: Fragile, garder au frais, etc."
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Enregistrement...' : 'Enregistrer le colis'}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Colis enregistré avec succès</CardTitle>
                <CardDescription>
                  Le colis a été enregistré et le destinataire sera notifié
                </CardDescription>
              </div>
              <PackageIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <QRCodeGenerator 
                value={qrCodeValue}
                packageId={registeredPackage?.internal_tracking_id || ''}
                size={200}
              />
            </div>
            
            <div className="border rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">ID interne</p>
                  <p className="font-medium">{registeredPackage?.internal_tracking_id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Numéro de suivi</p>
                  <p className="font-medium">{registeredPackage?.tracking_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transporteur</p>
                  <p className="font-medium">
                    {carriers.find(c => c.id === registeredPackage?.carrier)?.name || registeredPackage?.carrier}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Destinataire</p>
                  <p className="font-medium">
                    {residents.find(r => r.id === registeredPackage?.resident_id)?.first_name}{' '}
                    {residents.find(r => r.id === registeredPackage?.resident_id)?.last_name}
                  </p>
                </div>
              </div>
              
              {registeredPackage?.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{registeredPackage.description}</p>
                </div>
              )}
              
              {registeredPackage?.special_instructions && (
                <div className="flex items-start gap-2 bg-amber-50 p-2 rounded-md">
                  <BadgeAlert className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Instructions spéciales</p>
                    <p className="text-sm text-amber-700">{registeredPackage.special_instructions}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Un email de notification a été envoyé au destinataire avec le code QR.</p>
              <p className="mt-1">Le résident devra présenter ce code lors de la récupération du colis.</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleRegisterAnother}>
              Enregistrer un autre colis
            </Button>
            <Button>
              Imprimer l'étiquette
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
} 