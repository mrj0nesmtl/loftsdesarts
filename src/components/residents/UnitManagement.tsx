'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { HomeIcon, PlusCircleIcon, Pencil } from 'lucide-react';

// Type for building unit
type BuildingUnit = {
  id: string;
  unit_number: string;
  floor_number: number;
  square_footage: number;
  bedrooms: number;
  bathrooms: number;
  is_occupied: boolean;
  created_at: string;
  updated_at: string;
  building_id: string;
  unit_type: string;
  occupant_name?: string;
};

export default function UnitManagement() {
  const { toast } = useToast();
  const [units, setUnits] = useState<BuildingUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<BuildingUnit | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [buildingId, setBuildingId] = useState<string | null>(null);

  // Form state for new unit
  const [newUnit, setNewUnit] = useState({
    unit_number: '',
    floor_number: 1,
    square_footage: 0,
    bedrooms: 1,
    bathrooms: 1,
    is_occupied: false,
    unit_type: 'residential',
    building_id: ''
  });

  // Load building units
  useEffect(() => {
    const fetchUnits = async () => {
      setLoading(true);
      
      try {
        // Use the building ID directly from the CSV export
        const buildingId = "f0d44d67-b0b4-4194-b866-52cdf3b5fe89"; // Hardcoded ID for Lofts des Arts
        
        console.log("UnitManagement: Using building ID:", buildingId);
        setBuildingId(buildingId);
        
        if (!buildingId) {
          throw new Error('Building ID not available');
        }
        
        // Update new unit form with building ID
        setNewUnit(prev => ({
          ...prev,
          building_id: buildingId
        }));
        
        // Then fetch units for this specific building
        const { data, error } = await supabase
          .from('building_units')
          .select('*')
          .eq('building_id', buildingId)
          .order('unit_number');
        
        if (error) {
          console.error("UnitManagement: Error fetching building units:", error);
          throw error;
        }
        
        console.log(`UnitManagement: Retrieved ${data?.length || 0} building units`);
        setUnits(data || []);
      } catch (error: any) {
        console.error('UnitManagement: Error fetching building units:', error);
        console.error('UnitManagement: Error details:', error?.message, error?.details, error?.hint);
        toast({
          title: "Erreur",
          description: `Impossible de charger les unités. ${error?.message || 'Veuillez réessayer.'}`,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUnits();
  }, [toast]);

  // Filter units based on search query
  const filteredUnits = units.filter(unit => 
    unit.unit_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `Étage ${unit.floor_number}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (isEditDialogOpen && selectedUnit) {
      setSelectedUnit({
        ...selectedUnit,
        [name]: type === 'checkbox' ? checked : 
               type === 'number' ? Number(value) : value
      });
    } else {
      setNewUnit({
        ...newUnit,
        [name]: type === 'checkbox' ? checked : 
               type === 'number' ? Number(value) : value
      });
    }
  };

  // Add a new unit
  const addUnit = async () => {
    if (!buildingId) {
      toast({
        title: "Erreur",
        description: "Impossible d'identifier le bâtiment. Veuillez réessayer.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const unitData = {
        ...newUnit,
        building_id: buildingId
      };
      
      const { data, error } = await supabase
        .from('building_units')
        .insert([unitData])
        .select();
        
      if (error) throw error;
      
      setUnits([...units, data[0]]);
      setIsAddDialogOpen(false);
      setNewUnit({
        unit_number: '',
        floor_number: 1,
        square_footage: 0,
        bedrooms: 1,
        bathrooms: 1,
        is_occupied: false,
        unit_type: 'residential',
        building_id: buildingId
      });
      
      toast({
        title: "Unité ajoutée",
        description: `L'unité ${data[0].unit_number} a été ajoutée avec succès.`
      });
    } catch (error) {
      console.error('Error adding unit:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'unité. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  // Update an existing unit
  const updateUnit = async () => {
    if (!selectedUnit) return;
    
    try {
      const { data, error } = await supabase
        .from('building_units')
        .update({
          unit_number: selectedUnit.unit_number,
          floor_number: selectedUnit.floor_number,
          square_footage: selectedUnit.square_footage,
          bedrooms: selectedUnit.bedrooms,
          bathrooms: selectedUnit.bathrooms,
          is_occupied: selectedUnit.is_occupied,
          unit_type: selectedUnit.unit_type || 'residential'
        })
        .eq('id', selectedUnit.id)
        .select();
        
      if (error) throw error;
      
      // Update units state
      setUnits(units.map(unit => 
        unit.id === selectedUnit.id ? data[0] : unit
      ));
      
      setIsEditDialogOpen(false);
      setSelectedUnit(null);
      
      toast({
        title: "Unité mise à jour",
        description: `L'unité ${data[0].unit_number} a été mise à jour avec succès.`
      });
    } catch (error) {
      console.error('Error updating unit:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'unité. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion des Unités</h2>
          <p className="text-muted-foreground mt-1">
            Gérez les unités de l'immeuble
          </p>
        </div>
        
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Nouvelle Unité
        </Button>
      </div>
      
      {/* Search */}
      <div className="relative w-full">
        <Input
          placeholder="Rechercher une unité..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Units grid */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Liste des unités</CardTitle>
          <CardDescription>
            {filteredUnits.length} unité(s) dans l'immeuble
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredUnits.length === 0 ? (
            <div className="text-center py-8">
              <HomeIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Aucune unité trouvée</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {units.length === 0
                  ? "Vous n'avez pas encore ajouté d'unités."
                  : "Aucune unité ne correspond à votre recherche."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUnits.map((unit) => (
                <div
                  key={unit.id}
                  className="border rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">Unité {unit.unit_number}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedUnit(unit);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-2 text-sm text-muted-foreground">
                    Étage {unit.floor_number} • {unit.square_footage} pi²
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    {unit.unit_type === 'residential' ? (
                      <>
                        <Badge variant="secondary">{unit.bedrooms} chambre(s)</Badge>
                        <Badge variant="secondary">{unit.bathrooms} salle(s) de bain</Badge>
                      </>
                    ) : (
                      <Badge variant="secondary">Commercial</Badge>
                    )}

                    {unit.is_occupied ? (
                      <Badge className="bg-green-500 text-white">Occupé</Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-500 text-amber-500">Vacant</Badge>
                    )}
                    
                    {unit.occupant_name && (
                      <Badge variant="outline" className="border-blue-500 text-blue-500">
                        {unit.occupant_name}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add unit dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle unité</DialogTitle>
            <DialogDescription>
              Entrez les détails de la nouvelle unité
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit_number">Numéro d'unité</Label>
                <Input
                  id="unit_number"
                  name="unit_number"
                  placeholder="ex: 101"
                  value={newUnit.unit_number}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="floor_number">Étage</Label>
                <Input
                  id="floor_number"
                  name="floor_number"
                  type="number"
                  min="1"
                  value={newUnit.floor_number}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="square_footage">Superficie (pi²)</Label>
              <Input
                id="square_footage"
                name="square_footage"
                type="number"
                min="0"
                value={newUnit.square_footage}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Chambres</Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  min="0"
                  value={newUnit.bedrooms}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Salles de bain</Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  min="0"
                  step="0.5"
                  value={newUnit.bathrooms}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="is_occupied"
                name="is_occupied"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={newUnit.is_occupied}
                onChange={handleInputChange}
              />
              <Label htmlFor="is_occupied">Actuellement occupé</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={addUnit}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit unit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier une unité</DialogTitle>
            <DialogDescription>
              Modifiez les détails de l'unité
            </DialogDescription>
          </DialogHeader>
          
          {selectedUnit && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_unit_number">Numéro d'unité</Label>
                  <Input
                    id="edit_unit_number"
                    name="unit_number"
                    value={selectedUnit.unit_number}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit_floor_number">Étage</Label>
                  <Input
                    id="edit_floor_number"
                    name="floor_number"
                    type="number"
                    min="1"
                    value={selectedUnit.floor_number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_square_footage">Superficie (pi²)</Label>
                <Input
                  id="edit_square_footage"
                  name="square_footage"
                  type="number"
                  min="0"
                  value={selectedUnit.square_footage}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_bedrooms">Chambres</Label>
                  <Input
                    id="edit_bedrooms"
                    name="bedrooms"
                    type="number"
                    min="0"
                    value={selectedUnit.bedrooms}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit_bathrooms">Salles de bain</Label>
                  <Input
                    id="edit_bathrooms"
                    name="bathrooms"
                    type="number"
                    min="0"
                    step="0.5"
                    value={selectedUnit.bathrooms}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  id="edit_is_occupied"
                  name="is_occupied"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={selectedUnit.is_occupied}
                  onChange={handleInputChange}
                />
                <Label htmlFor="edit_is_occupied">Actuellement occupé</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={updateUnit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 