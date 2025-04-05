'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlusIcon, SearchIcon, BuildingIcon, FilterIcon } from 'lucide-react';
import UnitManagement from '@/components/residents/UnitManagement';

// Types for database models
type BuildingUnit = {
  id: string;
  unit_number: string;
  floor_number: number;
  square_footage: number;
  bedrooms: number;
  bathrooms: number;
  is_occupied: boolean;
  building_id: string;
  unit_type: string;
  occupant_name?: string;
};

type Resident = {
  id: string;
  user_id: string | null;
  building_id: string;
  unit_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_owner: boolean;
  is_primary_resident: boolean;
  move_in_date: string | null;
  move_out_date: string | null;
  preferred_language: string;
  preferred_notification_method: string;
  notes: string;
  created_at: string;
  updated_at: string;
  // Join fields
  unit_number?: string;
  floor_number?: number;
};

export default function ResidentsPage() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('residents');
  const [residents, setResidents] = useState<Resident[]>([]);
  const [buildingUnits, setBuildingUnits] = useState<BuildingUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOwnership, setFilterOwnership] = useState<string>('all'); // 'all', 'owners', 'tenants'
  const [filterUnit, setFilterUnit] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);

  // Function to fetch data used by other methods
  const fetchData = async () => {
    setLoading(true);
    
    try {
      // Use the building ID directly from the CSV export
      const buildingId = "f0d44d67-b0b4-4194-b866-52cdf3b5fe89"; // Hardcoded ID for Lofts des Arts
      
      console.log("Using building ID:", buildingId);
      
      if (!buildingId) {
        throw new Error('Building ID not available');
      }
      
      // Fetch building units for the specific building first
      const { data: unitData, error: unitError } = await supabase
        .from('building_units')
        .select('*')
        .eq('building_id', buildingId)
        .order('unit_number');
      
      if (unitError) {
        console.error("Error fetching building units:", unitError);
        throw unitError;
      }
      
      console.log(`Retrieved ${unitData?.length || 0} building units`);
      setBuildingUnits(unitData || []);
      
      // Fetch residents with their unit information
      const { data: residentData, error: residentError } = await supabase
        .from('residents')
        .select(`
          *,
          building_units(id, unit_number, floor_number)
        `)
        .eq('building_id', buildingId);
      
      if (residentError) {
        console.error("Error fetching residents:", residentError);
        throw residentError;
      }
      
      console.log(`Retrieved ${residentData?.length || 0} residents`);
      
      // Transform data to include unit_number directly on resident
      const processedResidents = residentData?.map(resident => {
        return {
          ...resident,
          unit_number: resident.building_units?.unit_number,
          floor_number: resident.building_units?.floor_number
        };
      }) || [];
      
      setResidents(processedResidents);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      console.error('Error details:', error?.message, error?.details, error?.hint);
      toast({
        title: "Erreur",
        description: `Impossible de charger les données. ${error?.message || 'Veuillez réessayer.'}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load residents and building units
  useEffect(() => {
    fetchData();
  }, [toast]);

  // Filter residents based on search query and filters
  const filteredResidents = residents.filter(resident => {
    // Search by name or email or unit
    const matchesSearch = 
      searchQuery === '' || 
      `${resident.first_name} ${resident.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.unit_number?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by ownership
    const matchesOwnership = 
      filterOwnership === 'all' || 
      (filterOwnership === 'owners' && resident.is_owner) ||
      (filterOwnership === 'tenants' && !resident.is_owner);
    
    // Filter by unit
    const matchesUnit = 
      filterUnit === 'all' || 
      resident.unit_id === filterUnit;
    
    return matchesSearch && matchesOwnership && matchesUnit;
  });

  // Add mock example data if no residents exist
  const addExampleData = async () => {
    if (residents.length > 0) {
      toast({
        title: "Données existantes",
        description: "Des résidents existent déjà dans la base de données.",
      });
      return;
    }
    
    try {
      // Use the building ID directly from the CSV export
      const buildingId = "f0d44d67-b0b4-4194-b866-52cdf3b5fe89"; // Hardcoded ID for Lofts des Arts
      
      console.log("addExampleData: Using building ID:", buildingId);
      
      if (!buildingId) {
        throw new Error('Building ID not available');
      }
      
      // Check if we have building units
      if (buildingUnits.length === 0) {
        toast({
          title: "Erreur",
          description: "Aucune unité de logement trouvée. Veuillez d'abord créer des unités.",
          variant: "destructive"
        });
        return;
      }
      
      // Select some random units for our sample residents - focusing on occupied units
      const sampleUnits = buildingUnits
        .filter(unit => unit.unit_type === 'residential' && unit.is_occupied)
        .slice(0, 10);
      
      // If we don't have enough occupied units, just use any residential units
      if (sampleUnits.length < 5) {
        const moreUnits = buildingUnits
          .filter(unit => unit.unit_type === 'residential' && !sampleUnits.find(u => u.id === unit.id))
          .slice(0, 10 - sampleUnits.length);
        
        sampleUnits.push(...moreUnits);
      }
      
      if (sampleUnits.length === 0) {
        toast({
          title: "Erreur",
          description: "Aucune unité résidentielle trouvée pour ajouter des exemples.",
          variant: "destructive"
        });
        return;
      }
      
      console.log(`Found ${sampleUnits.length} units to populate with residents`);
      
      // Create example residents for these units
      const exampleResidents = sampleUnits.map((unit, index) => {
        // Generate realistic French names
        const firstNames = ['Sophie', 'Mathieu', 'Isabelle', 'Jean', 'Marie', 'Pierre', 'Céline', 'François', 'Nathalie', 'Philippe'];
        const lastNames = ['Tremblay', 'Roy', 'Gagnon', 'Côté', 'Bouchard', 'Gauthier', 'Morin', 'Lavoie', 'Fortin', 'Gagné'];
        
        const firstName = firstNames[index % firstNames.length];
        const lastName = lastNames[index % lastNames.length];
        
        // Create email based on name
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
        
        // Generate a Montreal phone number
        const areaCode = ['514', '438', '579'][Math.floor(Math.random() * 3)];
        const phoneDigits = Math.floor(100000 + Math.random() * 900000);
        const phone = `${areaCode}-${Math.floor(phoneDigits / 1000)}-${phoneDigits % 1000}`;
        
        // Random move-in date in the last 3 years
        const today = new Date();
        const threeYearsAgo = new Date(today);
        threeYearsAgo.setFullYear(today.getFullYear() - 3);
        const moveInTimestamp = threeYearsAgo.getTime() + Math.random() * (today.getTime() - threeYearsAgo.getTime());
        const moveInDate = new Date(moveInTimestamp).toISOString().split('T')[0];
        
        return {
          building_id: buildingId,
          unit_id: unit.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          is_owner: Math.random() > 0.3, // 70% chance of being owner
          is_primary_resident: true,
          move_in_date: moveInDate,
          preferred_language: Math.random() > 0.3 ? 'fr' : 'en', // 70% French, 30% English
          preferred_notification_method: ['email', 'sms', 'app'][Math.floor(Math.random() * 3)],
          notes: ''
        };
      });
      
      console.log(`Prepared ${exampleResidents.length} sample residents`);
      
      // Insert the example residents
      const { data, error } = await supabase
        .from('residents')
        .insert(exampleResidents)
        .select();
        
      if (error) {
        console.error('Error inserting residents:', error);
        throw error;
      }
      
      console.log(`Successfully inserted ${data?.length || 0} residents`);
      
      // Refresh the residents list
      await fetchData();
      
      toast({
        title: "Données ajoutées",
        description: `${exampleResidents.length} résidents exemples ont été ajoutés avec succès.`,
      });
    } catch (error: any) {
      console.error('Error adding example data:', error);
      console.error('Error details:', error?.message, error?.details, error?.hint);
      toast({
        title: "Erreur",
        description: `Impossible d'ajouter les données exemples. ${error?.message || ''}`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Résidents</h1>
          <p className="text-muted-foreground mt-2">
            Gérez les propriétaires, locataires et unités du syndicat
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="residents" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="residents">Résidents</TabsTrigger>
          <TabsTrigger value="units">Unités</TabsTrigger>
        </TabsList>
        
        <TabsContent value="residents" className="mt-6">
          <div className="flex justify-end mb-4">
            <div className="flex space-x-2">
              <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center">
                <UserPlusIcon className="mr-2 h-4 w-4" />
                Nouveau Résident
              </Button>
              
              {residents.length === 0 && (
                <Button variant="outline" onClick={addExampleData}>
                  Ajouter des exemples
                </Button>
              )}
            </div>
          </div>
          
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email ou unité..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap md:flex-nowrap">
              <div className="flex items-center gap-2">
                <Label>Statut:</Label>
                <Select value={filterOwnership} onValueChange={setFilterOwnership}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="owners">Propriétaires</SelectItem>
                    <SelectItem value="tenants">Locataires</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Label>Unité:</Label>
                <Select value={filterUnit} onValueChange={setFilterUnit}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    {buildingUnits.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.unit_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Residents table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Liste des résidents</CardTitle>
              <CardDescription>
                {filteredResidents.length === 0
                  ? 'Aucun résident trouvé'
                  : `${filteredResidents.length} résident(s) trouvé(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center my-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredResidents.length === 0 ? (
                <div className="text-center py-8">
                  <BuildingIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Aucun résident trouvé</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {residents.length === 0
                      ? "Vous n'avez pas encore ajouté de résidents."
                      : "Aucun résident ne correspond à vos critères de recherche."}
                  </p>
                  {residents.length === 0 && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={addExampleData}
                    >
                      Ajouter des exemples de résidents
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium">Nom</th>
                        <th className="text-left py-3 px-4 font-medium">Unité</th>
                        <th className="text-left py-3 px-4 font-medium">Statut</th>
                        <th className="text-left py-3 px-4 font-medium">Contact</th>
                        <th className="text-left py-3 px-4 font-medium">Date d'arrivée</th>
                        <th className="text-right py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredResidents.map((resident) => (
                        <tr key={resident.id} className="hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{resident.first_name} {resident.last_name}</div>
                            {resident.is_primary_resident && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                Résident principal
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium">{resident.unit_number || 'N/A'}</div>
                            <div className="text-muted-foreground text-xs">
                              Étage {resident.floor_number || 'N/A'}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {resident.is_owner ? (
                              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                                Propriétaire
                              </span>
                            ) : (
                              <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded-full text-xs">
                                Locataire
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div>{resident.email}</div>
                            <div className="text-muted-foreground text-xs">{resident.phone}</div>
                          </td>
                          <td className="py-3 px-4">
                            {resident.move_in_date 
                              ? new Date(resident.move_in_date).toLocaleDateString('fr-CA') 
                              : 'N/A'
                            }
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedResident(resident);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              Modifier
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add resident dialog - to be implemented */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau résident</DialogTitle>
                <DialogDescription>
                  Entrez les informations du résident.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <p className="text-muted-foreground text-sm text-center">
                  La fonctionnalité d'ajout sera implémentée prochainement.
                </p>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit resident dialog - to be implemented */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Modifier un résident</DialogTitle>
                <DialogDescription>
                  Modifiez les informations du résident.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <p className="text-muted-foreground text-sm text-center">
                  La fonctionnalité de modification sera implémentée prochainement.
                </p>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="units" className="mt-6">
          {/* Only render the UnitManagement component when we're on the units tab */}
          {activeTab === 'units' && <UnitManagement />}
        </TabsContent>
      </Tabs>
    </div>
  );
} 