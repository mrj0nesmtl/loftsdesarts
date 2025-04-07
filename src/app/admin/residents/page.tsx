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

// Helper function to get user role safely
async function get_user_role(userId: string | undefined) {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (error) {
      // Only log an error message if there's actually an error object with properties
      if (error.message || error.details) {
        console.error("Error fetching role:", error);
      } else {
        // This handles empty error objects {} which can happen with some Supabase responses
        console.log("No user profile found for ID:", userId);
      }
      return null;
    }
    
    return data?.role;
  } catch (e) {
    console.error("Exception in get_user_role:", e);
    return null;
  }
}

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
      
      // Debug log the current user role
      const userId = user?.id;
      console.log('Current user ID:', userId);
      console.log('Current user role:', await get_user_role(userId));
      
      // First, try a simple query without the join to ensure basic access works
      console.log('Attempting to query residents table directly...');
      const { data: simpleResidentData, error: simpleResidentError } = await supabase
        .from('residents')
        .select('*');
      
      if (simpleResidentError) {
        console.error("Error with simple residents query:", simpleResidentError);
        console.error("Error details:", simpleResidentError?.message, simpleResidentError?.details, simpleResidentError?.hint);
      } else {
        console.log(`Simple query got ${simpleResidentData?.length || 0} residents (all buildings)`);
      }
      
      // Now let's try with the building filter
      console.log('Querying residents for specific building ID:', buildingId);
      const { data: residentData, error: residentError } = await supabase
        .from('residents')
        .select('*')
        .eq('building_id', buildingId);
      
      if (residentError) {
        console.error("Error fetching residents:", residentError);
        throw residentError;
      }
      
      console.log(`Retrieved ${residentData?.length || 0} residents for building ID ${buildingId}`);
      
      // Try a more advanced query only if the simple one succeeded
      let finalResidentData = residentData;
      if (residentData && residentData.length > 0) {
        console.log('Performing join query with building_units...');
        const { data: joinResidentData, error: joinResidentError } = await supabase
          .from('residents')
          .select(`
            *,
            building_units(id, unit_number, floor_number)
          `)
          .eq('building_id', buildingId);
        
        if (joinResidentError) {
          console.error("Error with join query:", joinResidentError);
          // Continue with the simple data
        } else {
          console.log(`Join query retrieved ${joinResidentData?.length || 0} residents with unit data`);
          
          // Use the join data if successful
          finalResidentData = joinResidentData;
        }
      }
      
      // Transform data to include unit_number directly on resident
      const processedResidents = finalResidentData?.map(resident => {
        return {
          ...resident,
          unit_number: resident.building_units?.unit_number || 'N/A',
          floor_number: resident.building_units?.floor_number || 'N/A'
        };
      }) || [];
      
      console.log('Final processed residents:', processedResidents.length);
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
      
      // Simplify by using hardcoded data similar to the residents_rows.csv
      const exampleResidents = [
        {
          building_id: buildingId,
          unit_id: "18ce0819-8366-44c1-964d-20562ce6b59f",
          first_name: "Nathalie",
          last_name: "Fortin",
          email: "nathalie.fortin@example.com",
          phone: "514-263-4045",
          is_owner: false,
          is_primary_resident: true,
          move_in_date: "2023-07-20",
          preferred_language: "fr",
          preferred_notification_method: "sms"
        },
        {
          building_id: buildingId,
          unit_id: "589cd5a6-4050-41af-8508-289aec34944a",
          first_name: "Céline",
          last_name: "Morin",
          email: "celine.morin@example.com",
          phone: "579-369-8920",
          is_owner: true,
          is_primary_resident: true,
          move_in_date: "2025-01-15",
          preferred_language: "fr",
          preferred_notification_method: "email"
        },
        {
          building_id: buildingId,
          unit_id: "af997e88-1385-4850-828b-66d194d8bce0",
          first_name: "Sophie",
          last_name: "Tremblay",
          email: "sophie.tremblay@example.com",
          phone: "579-868-8333",
          is_owner: true,
          is_primary_resident: true,
          move_in_date: "2022-08-05",
          preferred_language: "en",
          preferred_notification_method: "sms"
        }
      ];
      
      console.log(`Prepared ${exampleResidents.length} sample residents to insert`);
      
      // Try a direct SQL INSERT approach if RLS still causes issues
      console.log('Attempting to insert residents...');
      const { data, error } = await supabase
        .from('residents')
        .insert(exampleResidents)
        .select();
        
      if (error) {
        console.error('Error inserting residents:', error);
        console.error('Error details:', error?.message, error?.details, error?.hint);
        
        // If the error persists, show a more direct message about the RLS issue
        toast({
          title: "Erreur d'insertion",
          description: `Impossible d'ajouter les résidents. Erreur: ${error.message}. Veuillez vérifier les politiques RLS dans Supabase.`,
          variant: "destructive"
        });
        
        return;
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

  // Force sample data for testing if needed
  const forceTestData = () => {
    console.log('Forcing test resident data for display');
    const buildingId = 'f0d44d67-b0b4-4194-b866-52cdf3b5fe89'; // Lofts des Arts
    
    const testResidents: Resident[] = [
      {
        id: crypto.randomUUID(),
        user_id: null,
        building_id: buildingId,
        unit_id: crypto.randomUUID(),
        first_name: 'Joseph',
        last_name: 'LEVY',
        email: 'joseph.levy@example.com',
        phone: '514-756-8836',
        is_owner: true,
        is_primary_resident: true,
        move_in_date: '2020-01-01',
        move_out_date: null,
        preferred_language: 'fr',
        preferred_notification_method: 'email',
        notes: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        unit_number: '201',
        floor_number: 2
      },
      {
        id: crypto.randomUUID(),
        user_id: null,
        building_id: buildingId,
        unit_id: crypto.randomUUID(),
        first_name: 'Elizabeth',
        last_name: 'Roy',
        email: 'elizabeth.roy@example.com',
        phone: '514-239-7224',
        is_owner: true,
        is_primary_resident: true,
        move_in_date: '2020-01-01',
        move_out_date: null,
        preferred_language: 'fr',
        preferred_notification_method: 'email',
        notes: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        unit_number: '202',
        floor_number: 2
      },
      {
        id: crypto.randomUUID(),
        user_id: null,
        building_id: buildingId,
        unit_id: crypto.randomUUID(),
        first_name: 'Andrew',
        last_name: 'Adamian',
        email: 'andrew.adamian@example.com',
        phone: '514-558-2533',
        is_owner: true,
        is_primary_resident: true,
        move_in_date: '2020-01-01',
        move_out_date: null,
        preferred_language: 'en',
        preferred_notification_method: 'email',
        notes: 'Bureau: (202) 468-0110',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        unit_number: '203',
        floor_number: 2
      },
      {
        id: crypto.randomUUID(),
        user_id: null,
        building_id: buildingId,
        unit_id: crypto.randomUUID(),
        first_name: 'Sandie',
        last_name: 'Quinn',
        email: 'sandie.quinn@example.com',
        phone: '514-558-2533',
        is_owner: true,
        is_primary_resident: false,
        move_in_date: '2020-01-01',
        move_out_date: null,
        preferred_language: 'en',
        preferred_notification_method: 'sms',
        notes: 'Mobile: 514-565-6301',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        unit_number: '203',
        floor_number: 2
      },
      {
        id: crypto.randomUUID(),
        user_id: null,
        building_id: buildingId,
        unit_id: crypto.randomUUID(),
        first_name: 'Isabelle',
        last_name: 'BETTEZ',
        email: 'isabelle.bettez@example.com',
        phone: '514-941-9323',
        is_owner: true,
        is_primary_resident: true,
        move_in_date: '2020-01-01',
        move_out_date: null,
        preferred_language: 'fr',
        preferred_notification_method: 'email',
        notes: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        unit_number: '204',
        floor_number: 2
      },
      {
        id: crypto.randomUUID(),
        user_id: null,
        building_id: buildingId,
        unit_id: crypto.randomUUID(),
        first_name: 'Ayaaz',
        last_name: 'Merali',
        email: 'ayaaz.merali@example.com',
        phone: '647-865-6624',
        is_owner: true,
        is_primary_resident: true,
        move_in_date: '2020-01-01',
        move_out_date: null,
        preferred_language: 'en',
        preferred_notification_method: 'email',
        notes: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        unit_number: '205',
        floor_number: 2
      },
      {
        id: crypto.randomUUID(),
        user_id: null,
        building_id: buildingId,
        unit_id: crypto.randomUUID(),
        first_name: 'Chemseddine',
        last_name: 'BELGHITH',
        email: 'chemseddine.belghith@example.com',
        phone: '438-509-9143',
        is_owner: false,
        is_primary_resident: true,
        move_in_date: '2020-01-01',
        move_out_date: null,
        preferred_language: 'fr',
        preferred_notification_method: 'sms',
        notes: 'Locataire',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        unit_number: '205',
        floor_number: 2
      },
      {
        id: crypto.randomUUID(),
        user_id: null,
        building_id: buildingId,
        unit_id: crypto.randomUUID(),
        first_name: 'Manish',
        last_name: 'Kapoor',
        email: 'manish.kapoor@example.com',
        phone: '514-999-2847',
        is_owner: true,
        is_primary_resident: true,
        move_in_date: '2020-01-01',
        move_out_date: null,
        preferred_language: 'en',
        preferred_notification_method: 'email',
        notes: 'Bureau: 514-999-2847',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        unit_number: '206',
        floor_number: 2
      },
      {
        id: crypto.randomUUID(),
        user_id: null,
        building_id: buildingId,
        unit_id: crypto.randomUUID(),
        first_name: 'Marc-André',
        last_name: 'PARENT DEMERS',
        email: 'marc-andre.parent-demers@example.com',
        phone: '514-501-9493',
        is_owner: false,
        is_primary_resident: true,
        move_in_date: '2020-01-01',
        move_out_date: null,
        preferred_language: 'fr',
        preferred_notification_method: 'sms',
        notes: 'Locataire',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        unit_number: '206',
        floor_number: 2
      },
      {
        id: crypto.randomUUID(),
        user_id: null,
        building_id: buildingId,
        unit_id: crypto.randomUUID(),
        first_name: 'Olga',
        last_name: 'Pehtereva',
        email: 'olga.pehtereva@example.com',
        phone: '514-659-2235',
        is_owner: true,
        is_primary_resident: true,
        move_in_date: '2020-01-01',
        move_out_date: null,
        preferred_language: 'fr',
        preferred_notification_method: 'email',
        notes: 'Bureau: 514-523-4291',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        unit_number: '207',
        floor_number: 2
      },
      {
        id: crypto.randomUUID(),
        user_id: null,
        building_id: buildingId,
        unit_id: crypto.randomUUID(),
        first_name: 'Abdallah',
        last_name: 'Traiaia',
        email: 'abdallah.traiaia@example.com',
        phone: '514-659-2235',
        is_owner: true,
        is_primary_resident: false,
        move_in_date: '2020-01-01',
        move_out_date: null,
        preferred_language: 'fr',
        preferred_notification_method: 'email',
        notes: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        unit_number: '207',
        floor_number: 2
      },
      {
        id: crypto.randomUUID(),
        user_id: null,
        building_id: buildingId,
        unit_id: crypto.randomUUID(),
        first_name: 'Corey',
        last_name: 'ARCHIBALD',
        email: 'corey.archibald@example.com',
        phone: '514-883-4982',
        is_owner: false,
        is_primary_resident: true,
        move_in_date: '2020-01-01',
        move_out_date: null,
        preferred_language: 'en',
        preferred_notification_method: 'sms',
        notes: 'Locataire',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        unit_number: '207',
        floor_number: 2
      },
      {
        id: crypto.randomUUID(),
        user_id: null,
        building_id: buildingId,
        unit_id: crypto.randomUUID(),
        first_name: 'Coralie',
        last_name: 'CARRERE',
        email: 'coralie.carrere@example.com',
        phone: '',
        is_owner: false,
        is_primary_resident: false,
        move_in_date: '2020-01-01',
        move_out_date: null,
        preferred_language: 'fr',
        preferred_notification_method: 'email',
        notes: 'Locataire',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        unit_number: '207',
        floor_number: 2
      },
      {
        id: crypto.randomUUID(),
        user_id: null,
        building_id: buildingId,
        unit_id: crypto.randomUUID(),
        first_name: 'Faysal',
        last_name: 'DANDACHI',
        email: 'faysal.dandachi@example.com',
        phone: '514-999-2434',
        is_owner: true,
        is_primary_resident: true,
        move_in_date: '2020-01-01',
        move_out_date: null,
        preferred_language: 'fr',
        preferred_notification_method: 'email',
        notes: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        unit_number: '208',
        floor_number: 2
      },
      {
        id: crypto.randomUUID(),
        user_id: null,
        building_id: buildingId,
        unit_id: crypto.randomUUID(),
        first_name: 'Anthony',
        last_name: 'Marshall',
        email: 'anthony.marshall@example.com',
        phone: '514-891-4653',
        is_owner: true,
        is_primary_resident: true,
        move_in_date: '2020-01-01',
        move_out_date: null,
        preferred_language: 'en',
        preferred_notification_method: 'email',
        notes: 'Bureau: 514-891-4653 x: 514',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        unit_number: '209',
        floor_number: 2
      }
    ];
    
    setResidents(testResidents);
    toast({
      title: "Données de test",
      description: `${testResidents.length} résidents de Lofts des Arts ont été chargés pour affichage.`,
    });
  };

  // Import real residents from Lofts des Arts
  const importRealResidents = async () => {
    try {
      // Use the building ID directly from the CSV export
      const buildingId = "f0d44d67-b0b4-4194-b866-52cdf3b5fe89"; // Hardcoded ID for Lofts des Arts
      
      console.log("Importing real residents to building ID:", buildingId);
      
      // Create a map of unit numbers to unit IDs (we'll need to fetch or create the proper units)
      const unitMap = new Map();
      
      // First, check if these units exist already
      const { data: existingUnits, error: unitError } = await supabase
        .from('building_units')
        .select('id, unit_number')
        .eq('building_id', buildingId);
        
      if (unitError) {
        console.error("Error fetching building units:", unitError);
        throw unitError;
      }
      
      // Populate the map with existing units
      existingUnits?.forEach(unit => {
        unitMap.set(unit.unit_number, unit.id);
      });
      
      // These are the unit numbers from the real resident data
      const requiredUnits = ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', 
                             '211', '212', '301', '302', '303', '304', '305', '306', '307', '308', 
                             '309', '310', '311', '312', '401', '402', '403', '404', '405', '406',
                             '407', '408', '409', '410', '411', '412', '501', '502', '503', '504', 
                             '505', '506', '507', '508', '509', '510', '511', '512', '601', '602',
                             '603', '604', '605', '606', '607', '608', '609', '610', '611', '612', '701',
                             '702', '703', '705', '706', '707', '709', '710', '711', '712', '801', '802',
                             '803', '804', '805', '806', '807', '809', '810', '811', '812', '901', '902',
                             '903', '904', '905', '906', '907', '909', '910', '911', '912', '1612', '1625',
                             'PH 03', 'PH 04', 'PH 05', 'PH 06', 'PH 07', 'PH 08', 'PH 09', 'PH 11'];
      
      // Create any missing units
      const unitsToCreate = [];
      for (const unitNumber of requiredUnits) {
        if (!unitMap.has(unitNumber)) {
          const floorNumber = parseInt(unitNumber.substring(0, 1));
          unitsToCreate.push({
            building_id: buildingId,
            unit_number: unitNumber,
            floor_number: floorNumber,
            unit_type: 'residential',
            is_occupied: true,
            square_footage: 1000, // Default value
            bedrooms: 2, // Default value
            bathrooms: 1 // Default value
          });
        }
      }
      
      // Create missing units if needed
      if (unitsToCreate.length > 0) {
        console.log(`Creating ${unitsToCreate.length} missing units`);
        const { data: newUnits, error: createError } = await supabase
          .from('building_units')
          .insert(unitsToCreate)
          .select();
          
        if (createError) {
          console.error("Error creating units:", createError);
          throw createError;
        }
        
        // Add the new units to our map
        newUnits?.forEach(unit => {
          unitMap.set(unit.unit_number, unit.id);
        });
      }
      
      // Now prepare the resident data from the image
      const realResidents = [
        // Page 1 of residents
        {
          building_id: buildingId,
          unit_id: unitMap.get('201'),
          first_name: 'Joseph',
          last_name: 'LEVY',
          email: 'joseph.levy@loftsdesarts.com',
          phone: '514-756-8836',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'SDC Loft des Arts Phase 1'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('202'),
          first_name: 'Elizabeth',
          last_name: 'Roy',
          email: 'elizabeth.roy@loftsdesarts.com',
          phone: '514-239-7224',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'SDC Loft des Arts Phase 1'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('203'),
          first_name: 'Andrew',
          last_name: 'Adamian',
          email: 'andrew.adamian@loftsdesarts.com',
          phone: '514-558-2533',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: 'Bureau: 202-468-0110'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('203'),
          first_name: 'Sandie',
          last_name: 'Quinn',
          email: 'sandie.quinn@loftsdesarts.com',
          phone: '514-558-2533',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 514-565-6301'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('204'),
          first_name: 'Isabelle',
          last_name: 'BETTEZ',
          email: 'isabelle.bettez@loftsdesarts.com',
          phone: '514-941-9323',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('205'),
          first_name: 'Ayaaz',
          last_name: 'Merali',
          email: 'ayaaz.merali@loftsdesarts.com',
          phone: '647-865-6624',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('205'),
          first_name: 'Chemseddine',
          last_name: 'BELGHITH',
          email: 'chemseddine.belghith@loftsdesarts.com',
          phone: '438-509-9143',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('206'),
          first_name: 'Manish',
          last_name: 'Kapoor',
          email: 'manish.kapoor@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: 'Bureau: 514-999-2847'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('206'),
          first_name: 'Marc-André',
          last_name: 'PARENT DEMERS',
          email: 'marc-andre.parent-demers@loftsdesarts.com',
          phone: '514-501-9493',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('207'),
          first_name: 'Olga',
          last_name: 'Pehtereva',
          email: 'olga.pehtereva@loftsdesarts.com',
          phone: '514-659-2235',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Bureau: 514-523-4291'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('207'),
          first_name: 'Abdallah',
          last_name: 'Traiaia',
          email: 'abdallah.traiaia@loftsdesarts.com',
          phone: '514-659-2235',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('207'),
          first_name: 'Corey',
          last_name: 'ARCHIBALD',
          email: 'corey.archibald@loftsdesarts.com',
          phone: '514-883-4982',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'sms',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('207'),
          first_name: 'Coralie',
          last_name: 'CARRERE',
          email: 'coralie.carrere@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('208'),
          first_name: 'Faysal',
          last_name: 'DANDACHI',
          email: 'faysal.dandachi@loftsdesarts.com',
          phone: '514-999-2434',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('209'),
          first_name: 'Anthony',
          last_name: 'Marshall',
          email: 'anthony.marshall@loftsdesarts.com',
          phone: '514-891-4653',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: 'Bureau: 514-891-4653 x: 514'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('210'),
          first_name: 'Theo',
          last_name: 'Ciju',
          email: 'theo.ciju@loftsdesarts.com',
          phone: '416-318-9324',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('210'),
          first_name: 'Monica',
          last_name: 'Ciju',
          email: 'monica.ciju@loftsdesarts.com',
          phone: '416-318-9324',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 416-318-9324'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('210'),
          first_name: 'Jean Carl',
          last_name: 'MOUBARAK',
          email: 'jean-carl.moubarak@loftsdesarts.com',
          phone: '514-219-7791',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('211'),
          first_name: 'Seyed-Ehsan',
          last_name: 'Kia',
          email: 'seyed-ehsan.kia@loftsdesarts.com',
          phone: '514-898-7469',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('212'),
          first_name: 'Nathalie',
          last_name: 'Paillé',
          email: 'nathalie.paille@loftsdesarts.com',
          phone: '514-795-8948',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'x: 514'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('212'),
          first_name: 'Luc',
          last_name: 'BERNARD',
          email: 'luc.bernard@loftsdesarts.com',
          phone: '514-772-3917',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 514-772-3917'
        },
        // Page 2 of residents (units 305-406)
        {
          building_id: buildingId,
          unit_id: unitMap.get('305'),
          first_name: 'Johann',
          last_name: 'BENSAADI',
          email: 'johann.bensaadi@loftsdesarts.com',
          phone: '514-946-3094',
          is_owner: false,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('305'),
          first_name: 'Mathieu',
          last_name: 'MURRAY-SAMUEL',
          email: 'mathieu.murray-samuel@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('306'),
          first_name: 'Shengmin',
          last_name: 'Li',
          email: 'shengmin.li@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: 'Bureau: 514-796-9806'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('306'),
          first_name: 'Fang Liu',
          last_name: 'Lin',
          email: 'fangliu.lin@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('306'),
          first_name: 'Antoine',
          last_name: 'PRODIQUE',
          email: 'antoine.prodique@loftsdesarts.com',
          phone: '438-989-4423',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('307'),
          first_name: 'Chia-Wei',
          last_name: 'TSAI',
          email: 'chia-wei.tsai@loftsdesarts.com',
          phone: '514-886-6453',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('307'),
          first_name: 'Andree',
          last_name: 'KABA',
          email: 'andree.kaba@loftsdesarts.com',
          phone: '514-649-0283',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('307'),
          first_name: 'Xiao',
          last_name: 'YANG',
          email: 'xiao.yang@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('308'),
          first_name: 'David',
          last_name: 'WOOD-DOWNEY',
          email: 'david.wood-downey@loftsdesarts.com',
          phone: '514-220-4655',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('309'),
          first_name: 'Diane',
          last_name: 'Dupuis',
          email: 'diane.dupuis@loftsdesarts.com',
          phone: '514-647-1625',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('309'),
          first_name: 'Yvan',
          last_name: 'Sirois',
          email: 'yvan.sirois@loftsdesarts.com',
          phone: '514-647-1625',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 514-647-1625'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('309'),
          first_name: 'Jean',
          last_name: 'CÔTÉ',
          email: 'jean.cote@loftsdesarts.com',
          phone: '418-261-2651',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('310'),
          first_name: 'Maxime',
          last_name: 'VERRET',
          email: 'maxime.verret@loftsdesarts.com',
          phone: '514-297-3337',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('310'),
          first_name: 'Claude',
          last_name: 'VIGNEAULT',
          email: 'claude.vigneault@loftsdesarts.com',
          phone: '514-297-3337',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 514-239-9555'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('311'),
          first_name: 'Thomas',
          last_name: 'Delannoy',
          email: 'thomas.delannoy@loftsdesarts.com',
          phone: '438-992-9827',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('311'),
          first_name: 'Adrian Esaul',
          last_name: 'Alvarez Montano',
          email: 'adrian.alvarez@loftsdesarts.com',
          phone: '438-992-9827',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 514-581-8528'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('312'),
          first_name: 'Roula',
          last_name: 'Asso',
          email: 'roula.asso@loftsdesarts.com',
          phone: '336-701-7596',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'ext. 6'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('312'),
          first_name: 'Benoit',
          last_name: 'Martimort',
          email: 'benoit.martimort@loftsdesarts.com',
          phone: '336-701-7596',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'ext. 6'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('312'),
          first_name: 'Mariana',
          last_name: 'FERNANDES MENDES',
          email: 'mariana.fernandes@loftsdesarts.com',
          phone: '778-848-9075',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'sms',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('312'),
          first_name: 'mathieu',
          last_name: 'THEREZIEN',
          email: 'mathieu.therezien@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('401'),
          first_name: 'Henry Leonardo',
          last_name: 'VEGA SANTOS',
          email: 'henry.vega@loftsdesarts.com',
          phone: '438-525-9962',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('402'),
          first_name: 'Jamie',
          last_name: 'Bridge',
          email: 'jamie.bridge@loftsdesarts.com',
          phone: '438-788-7555',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: 'Bureau: 450-800-0314'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('402'),
          first_name: 'David',
          last_name: 'Morissette',
          email: 'david.morissette@loftsdesarts.com',
          phone: '438-788-7555',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 514-692-0201'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('403'),
          first_name: 'Imelda',
          last_name: 'Cuellar',
          email: 'imelda.cuellar@loftsdesarts.com',
          phone: '514-518-6582',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('404'),
          first_name: 'Elena',
          last_name: 'COUTU',
          email: 'elena.coutu@loftsdesarts.com',
          phone: '819-852-7072',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('404'),
          first_name: 'Emilie',
          last_name: 'CÔTÉ',
          email: 'emilie.cote@loftsdesarts.com',
          phone: '514-632-5902',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire. Mobile: 514-632-5902'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('405'),
          first_name: 'Giordano',
          last_name: 'Cescutti',
          email: 'giordano.cescutti@loftsdesarts.com',
          phone: '514-771-3933',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('405'),
          first_name: 'Alexa',
          last_name: 'Everett',
          email: 'alexa.everett@loftsdesarts.com',
          phone: '514-771-3933',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 514-835-9433'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('405'),
          first_name: 'Samar',
          last_name: 'ABDOURAHMAN',
          email: 'samar.abdourahman@loftsdesarts.com',
          phone: '416-333-5008',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'sms',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('406'),
          first_name: 'Chantal',
          last_name: 'Albert',
          email: 'chantal.albert@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Bureau: 450-441-6015'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('406'),
          first_name: 'Christian',
          last_name: 'Michaud',
          email: 'christian.michaud@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 514-992-0356'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('407'),
          first_name: 'Gestion Fadi Rizk',
          last_name: 'Inc.',
          email: 'gestion.fadi.rizk@loftsdesarts.com',
          phone: '514-965-3234',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('407'),
          first_name: 'Margot',
          last_name: 'SILVERBLATT',
          email: 'margot.silverblatt@loftsdesarts.com',
          phone: '514-707-5807',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire. Mobile: 514-707-5807'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('408'),
          first_name: 'IMMOBILIÈRE DU SART S.A.',
          last_name: 's/a Olivier',
          email: 'immobiliere.dusart@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Bureau: 514-550-8111. Mobile: 438-765-4483'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('409'),
          first_name: 'Jean-Nicolas',
          last_name: 'Malouf',
          email: 'jean-nicolas.malouf@loftsdesarts.com',
          phone: '514-660-9886',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Bureau: 514-660-9886'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('409'),
          first_name: 'Jean-Nicolas',
          last_name: 'BRUNET-DUCLOS',
          email: 'jean-nicolas.brunet-duclos@loftsdesarts.com',
          phone: '514-290-3287',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire. Mobile: 514-290-3287'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('410'),
          first_name: 'Lise',
          last_name: 'Ahem',
          email: 'lise.ahem@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('410'),
          first_name: 'Pierre',
          last_name: 'Lestage',
          email: 'pierre.lestage@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 514-918-4126'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('411'),
          first_name: 'Stéphanie',
          last_name: 'Beaulieu',
          email: 'stephanie.beaulieu@loftsdesarts.com',
          phone: '438-882-2302',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('411'),
          first_name: 'Stephanie',
          last_name: 'BEAULIEU',
          email: 'stephanie.beaulieu2@loftsdesarts.com',
          phone: '438-882-2302',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('411'),
          first_name: 'Stephanie',
          last_name: 'BEAULIEU',
          email: 'stephanie.beaulieu3@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('412'),
          first_name: 'Marie-Victoria',
          last_name: 'BOUVERET',
          email: 'marie-victoria.bouveret@loftsdesarts.com',
          phone: '438-871-6805',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('412'),
          first_name: 'Guillaume',
          last_name: 'LAUTRETTE',
          email: 'guillaume.lautrette@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire. Mobile: 438-542-3057'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('412'),
          first_name: 'Clara',
          last_name: 'ROC',
          email: 'clara.roc@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('501'),
          first_name: 'Marie-Christine',
          last_name: 'Therrien',
          email: 'marie-christine.therrien@loftsdesarts.com',
          phone: '514-299-2096',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('502'),
          first_name: 'Viviane',
          last_name: 'Sokoluk',
          email: 'viviane.sokoluk@loftsdesarts.com',
          phone: '514-616-7496',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('503'),
          first_name: 'Eric',
          last_name: 'Séguin',
          email: 'eric.seguin@loftsdesarts.com',
          phone: '514-755-8493',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'x: 514'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('504'),
          first_name: 'Leyanis',
          last_name: 'Guevara Canete',
          email: 'leyanis.guevara@loftsdesarts.com',
          phone: '514-891-8898',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('504'),
          first_name: 'Emre',
          last_name: 'AGRASOY',
          email: 'emre.agrasoy@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'sms',
          notes: 'Locataire. Mobile: 514-476-7281'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('504'),
          first_name: 'TALIA',
          last_name: 'AMARU-KAPANTAIS',
          email: 'talia.amaru-kapantais@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('505'),
          first_name: '9329-5293 Québec',
          last_name: 'Inc.',
          email: 'quebec.inc@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Bureau: 514-812-3344'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('505'),
          first_name: 'Sandy',
          last_name: 'SAFI',
          email: 'sandy.safi@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire. Mobile: 514-627-4007'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('506'),
          first_name: 'Sara',
          last_name: 'Capen',
          email: 'sara.capen@loftsdesarts.com',
          phone: '514-781-8165',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Bureau: 514-939-0221'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('507'),
          first_name: 'LA SOCIÉTÉ TICA-ROCA CANADA',
          last_name: 'INC',
          email: 'tica-roca@loftsdesarts.com',
          phone: '514-267-2188',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('508'),
          first_name: 'Nicole',
          last_name: 'Perreault',
          email: 'nicole.perreault@loftsdesarts.com',
          phone: '514-379-4069',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('509'),
          first_name: 'Mathieu',
          last_name: 'BISSONNETTE',
          email: 'mathieu.bissonnette@loftsdesarts.com',
          phone: '514-795-0763',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('509'),
          first_name: 'Anaelle',
          last_name: 'SAUVET',
          email: 'anaelle.sauvet@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire. Mobile: 428-345-8424'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('510'),
          first_name: 'Julien',
          last_name: 'Bissonnette',
          email: 'julien.bissonnette@loftsdesarts.com',
          phone: '514-791-5037',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Bureau: 514-227-1654'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('511'),
          first_name: 'Jerome',
          last_name: 'Lavoie',
          email: 'jerome.lavoie@loftsdesarts.com',
          phone: '514-933-1930',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('512'),
          first_name: 'Emilie',
          last_name: 'CHAREST',
          email: 'emilie.charest@loftsdesarts.com',
          phone: '514-705-2204',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        // Page 4 of residents (units 601-701)
        {
          building_id: buildingId,
          unit_id: unitMap.get('601'),
          first_name: 'Jacques',
          last_name: 'Dominic',
          email: 'jacques.dominic@loftsdesarts.com',
          phone: '514-704-6414',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'x: 514'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('602'),
          first_name: 'Martine',
          last_name: 'Larin',
          email: 'martine.larin@loftsdesarts.com',
          phone: '514-912-3233',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('602'),
          first_name: 'Diego',
          last_name: 'MORET',
          email: 'diego.moret@loftsdesarts.com',
          phone: '07 89 82 73 71',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire. Mobile: 514-912-3233'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('603'),
          first_name: 'Wing Lan Fanny',
          last_name: 'Lee',
          email: 'winglan.lee@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('603'),
          first_name: 'Christopher Anthony',
          last_name: 'Palumbo',
          email: 'christopher.palumbo@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('603'),
          first_name: 'Imene',
          last_name: 'GHAZI',
          email: 'imene.ghazi@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire. Mobile: 438-377-7658'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('603'),
          first_name: 'Yanis',
          last_name: 'GHAZI',
          email: 'yanis.ghazi@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('604'),
          first_name: 'Lassaad',
          last_name: 'Kilani',
          email: 'lassaad.kilani@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Bureau: 514-677-3502'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('604'),
          first_name: 'Frederic Maertens',
          last_name: '(gestion)',
          email: 'frederic.maertens@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('604'),
          first_name: 'Maya',
          last_name: 'KILANI',
          email: 'maya.kilani@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire. Mobile: 514-574-5673'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('605'),
          first_name: 'Odélia',
          last_name: 'Solère',
          email: 'odelia.solere@loftsdesarts.com',
          phone: '06 59 91 29 60',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('605'),
          first_name: 'Adrien Ollilic',
          last_name: 'MAZARS MONTRÉAL',
          email: 'adrien.mazars@loftsdesarts.com',
          phone: '514-228-1443',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire. Mobile: 06 69 48 71 94'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('605'),
          first_name: 'Laureen Mousset',
          last_name: 'MICHAEL PAGE',
          email: 'laureen.michael-page@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('606'),
          first_name: 'Patty',
          last_name: 'Xenos',
          email: 'patty.xenos@loftsdesarts.com',
          phone: '514-574-4247',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('607'),
          first_name: 'Alain',
          last_name: 'PARÉ',
          email: 'alain.pare@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('607'),
          first_name: 'Beatrice',
          last_name: 'PARÉ',
          email: 'beatrice.pare@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 438-402-7174'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('608'),
          first_name: 'Justin',
          last_name: 'LIM',
          email: 'justin.lim@loftsdesarts.com',
          phone: '514-991-9010',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('608'),
          first_name: 'Ngoc Bich',
          last_name: 'LAI',
          email: 'ngocbich.lai@loftsdesarts.com',
          phone: '514-991-9010',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('609'),
          first_name: 'Maya Gwendolyn',
          last_name: 'SHAKRA-WINGATE',
          email: 'maya.wingate@loftsdesarts.com',
          phone: '202-290-6088',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('609'),
          first_name: 'Patrick',
          last_name: 'WINGATE',
          email: 'patrick.wingate@loftsdesarts.com',
          phone: '202-290-6088',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 514-891-3408'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('610'),
          first_name: 'Véronique Marie-Jeanne',
          last_name: 'Cornu',
          email: 'veronique.cornu@loftsdesarts.com',
          phone: '629 26 75 12',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Bureau: 629 26 75 12'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('610'),
          first_name: 'Kevin',
          last_name: 'OLIVEIRA CAMARA',
          email: 'kevin.oliveira@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire. Mobile: 514-813-0122'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('610'),
          first_name: 'Kevin',
          last_name: 'OLIVEIRA CAMARA',
          email: 'kevin.oliveira2@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('611'),
          first_name: 'Mangara Ndéye',
          last_name: 'Ramatoulaye',
          email: 'mangara.ramatoulaye@loftsdesarts.com',
          phone: '438-988-5767',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('611'),
          first_name: '',
          last_name: 'DENYS BILODID',
          email: 'denys.bilodid@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire. Mobile: 929-253-5440'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('612'),
          first_name: 'Mylène',
          last_name: 'CYR',
          email: 'mylene.cyr@loftsdesarts.com',
          phone: '514-842-7373',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('612'),
          first_name: 'Alain',
          last_name: 'SIMONEAU',
          email: 'alain.simoneau@loftsdesarts.com',
          phone: '514-842-7373',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 514-779-4183'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('612'),
          first_name: 'Michel',
          last_name: 'RIFFET',
          email: 'michel.riffet@loftsdesarts.com',
          phone: '581-988-5364',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('612'),
          first_name: 'Jing',
          last_name: 'ZHANG',
          email: 'jing.zhang@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('701'),
          first_name: 'Jacques',
          last_name: 'Germain',
          email: 'jacques.germain@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'x: 514'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('702'),
          first_name: 'Kaouther',
          last_name: 'OMRI',
          email: 'kaouther.omri@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('702'),
          first_name: 'Ridha',
          last_name: 'OMRI',
          email: 'ridha.omri@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('702'),
          first_name: 'Frederic',
          last_name: 'PORTE',
          email: 'frederic.porte@loftsdesarts.com',
          phone: '514-975-5782',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('703'),
          first_name: "DOMAINE DES LUCIOLES INC.",
          last_name: "a/s M",
          email: 'domaine.lucioles@loftsdesarts.com',
          phone: '514-941-4883',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('705'),
          first_name: "GESTION LIPLAN INC.",
          last_name: "a/s Lise Plante",
          email: 'gestion.liplan@loftsdesarts.com',
          phone: '514-377-7113',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('705'),
          first_name: "LOIC",
          last_name: "PLANTE BARSALO",
          email: 'loic.plante-barsalo@loftsdesarts.com',
          phone: '514-928-2646',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('706'),
          first_name: "2953-4482 QUÉBEC INC.",
          last_name: "a/s Jacques",
          email: 'quebec.inc.jacques@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'x: 514'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('707'),
          first_name: "Wally A.",
          last_name: "Kapakilli Suderman",
          email: 'wally.kapakilli@loftsdesarts.com',
          phone: '514-245-7909',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: 'Bureau: 416-706-2349'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('707'),
          first_name: "Tevfik Oruc",
          last_name: "Kapakilli",
          email: 'tevfik.kapakilli@loftsdesarts.com',
          phone: '514-245-7909',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 416-706-2349'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('707'),
          first_name: "Eren",
          last_name: "KAPAKILLI",
          email: 'eren.kapakilli@loftsdesarts.com',
          phone: '514-245-7909',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('709'),
          first_name: "Françoise",
          last_name: "NG CHOY HING",
          email: 'francoise.ngchoyhing@loftsdesarts.com',
          phone: '514-949-6547',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('710'),
          first_name: "Martin",
          last_name: "Levesque",
          email: 'martin.levesque@loftsdesarts.com',
          phone: '514-716-9654',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('710'),
          first_name: "Martin",
          last_name: "Moreau",
          email: 'martin.moreau@loftsdesarts.com',
          phone: '514-716-9654',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 514-253-8615'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('711'),
          first_name: "Marc-André",
          last_name: "Coutu",
          email: 'marc-andre.coutu@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Bureau: 514-234-0030'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('712'),
          first_name: "Denis",
          last_name: "Roy",
          email: 'denis.roy@loftsdesarts.com',
          phone: '581-306-1835',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('801'),
          first_name: "Maxime",
          last_name: "Aubin",
          email: 'maxime.aubin@loftsdesarts.com',
          phone: '514-557-8823',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('801'),
          first_name: "Marie-Pier",
          last_name: "CÉRAT",
          email: 'marie-pier.cerat@loftsdesarts.com',
          phone: '514-557-8823',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 514-713-3287'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('802'),
          first_name: "Maryse",
          last_name: "Beaulieu",
          email: 'maryse.beaulieu@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('802'),
          first_name: "Benoit",
          last_name: "Lavallée",
          email: 'benoit.lavallee@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 514-439-6729'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('803'),
          first_name: "Mario",
          last_name: "Giacomo",
          email: 'mario.giacomo@loftsdesarts.com',
          phone: '514-247-0015',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('803'),
          first_name: "Carl",
          last_name: "GIACOMO",
          email: 'carl.giacomo@loftsdesarts.com',
          phone: '514-444-4428',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('803'),
          first_name: "Cristina",
          last_name: "RIZZUTO",
          email: 'cristina.rizzuto@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('804'),
          first_name: "Dr Tarakdjian & Dre Hagopian SPRCP",
          last_name: "",
          email: 'tarakdjian.hagopian@loftsdesarts.com',
          phone: '514-910-9173',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Bureau: 514-733-7996'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('804'),
          first_name: "Aline",
          last_name: "GRENON",
          email: 'aline.grenon@loftsdesarts.com',
          phone: '514-284-3248',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('805'),
          first_name: "KTBT HOLDINGS LTD.",
          last_name: "a/s Terry Shllit",
          email: 'ktbt.holdings@loftsdesarts.com',
          phone: '514-884-4624',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('806'),
          first_name: "Colin",
          last_name: "Niven",
          email: 'colin.niven@loftsdesarts.com',
          phone: '514-970-0348',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: 'Bureau: 514-697-6030 x: 514'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('807'),
          first_name: "Florence",
          last_name: "Onar",
          email: 'florence.onar@loftsdesarts.com',
          phone: '438-492-5498',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Bureau: 438-492-5498'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('807'),
          first_name: "Victoire",
          last_name: "JEZEQUEL",
          email: 'victoire.jezequel@loftsdesarts.com',
          phone: '438-238-7434',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire. Mobile: 438-238-7434'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('807'),
          first_name: "hugo",
          last_name: "PAILLEUX",
          email: 'hugo.pailleux@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('809'),
          first_name: "CEF INVESTISSEMENTS INC.",
          last_name: "a/s D",
          email: 'cef.investissements@loftsdesarts.com',
          phone: '514-802-4688',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('809'),
          first_name: "Karen",
          last_name: "ORTEGA MARIN",
          email: 'karen.ortega-marin@loftsdesarts.com',
          phone: '514-894-9811',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('810'),
          first_name: "Christine",
          last_name: "Duby",
          email: 'christine.duby@loftsdesarts.com',
          phone: '514-806-2401',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('811'),
          first_name: "Alexandre",
          last_name: "Baril",
          email: 'alexandre.baril@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('811'),
          first_name: "Karolane",
          last_name: "Lachaine",
          email: 'karolane.lachaine@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 514-220-3768'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('812'),
          first_name: "Josée",
          last_name: "Darche",
          email: 'josee.darche@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('812'),
          first_name: "Michel",
          last_name: "Tremblay",
          email: 'michel.tremblay@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 514-295-3592'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('901'),
          first_name: "Louis-Daniel",
          last_name: "Hinse",
          email: 'louis-daniel.hinse@loftsdesarts.com',
          phone: '418-929-8869',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Bureau: 418-929-8869'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('902'),
          first_name: "Sofiane",
          last_name: "ACHICHE",
          email: 'sofiane.achiche@loftsdesarts.com',
          phone: '514-717-1503',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('903'),
          first_name: "François",
          last_name: "Coutu",
          email: 'francois.coutu@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('904'),
          first_name: "Robby",
          last_name: "Demlakian",
          email: 'robby.demlakian@loftsdesarts.com',
          phone: '514-946-1144',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('904'),
          first_name: "Kelli",
          last_name: "RICHARDS",
          email: 'kelli.richards@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'sms',
          notes: 'Locataire. Mobile: 514-577-7837'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('905'),
          first_name: "Marjorie",
          last_name: "GILBARD RETZLEFF",
          email: 'marjorie.gilbard-retzleff@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('905'),
          first_name: "Gerry",
          last_name: "RETZLEFF",
          email: 'gerry.retzleff@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 514-842-7960'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('906'),
          first_name: "Robby",
          last_name: "Demlakian",
          email: 'robby.demlakian2@loftsdesarts.com',
          phone: '514-946-1144',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('907'),
          first_name: "Jean-Louis",
          last_name: "Denis",
          email: 'jean-louis.denis@loftsdesarts.com',
          phone: '438-497-1625',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('907'),
          first_name: "Josee",
          last_name: "TESSIER",
          email: 'josee.tessier@loftsdesarts.com',
          phone: '514-596-2554',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('909'),
          first_name: "Hong",
          last_name: "Zhu",
          email: 'hong.zhu@loftsdesarts.com',
          phone: '514-581-0824',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('909'),
          first_name: "Jason",
          last_name: "JENNINGS",
          email: 'jason.jennings@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'sms',
          notes: 'Locataire. Mobile: 919-866-9782'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('909'),
          first_name: "Heather",
          last_name: "ZEIGRA",
          email: 'heather.zeigra@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('910'),
          first_name: "Stéphane",
          last_name: "Sansfaçon",
          email: 'stephane.sansfacon@loftsdesarts.com',
          phone: '450-280-9484',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'x: 514'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('911'),
          first_name: "1067005 ONTARIO LIMITED",
          last_name: "a/s Jeff",
          email: 'ontario.limited@loftsdesarts.com',
          phone: '613-291-5979',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('911'),
          first_name: "Tara-Leigh",
          last_name: "CANCINO BROUILLETTE",
          email: 'tara-leigh.cancino@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'sms',
          notes: 'Locataire. Mobile: 613-291-5979'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('911'),
          first_name: "Jeff",
          last_name: "MIERINS",
          email: 'jeff.mierins@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: 'Locataire'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('912'),
          first_name: "Frederico",
          last_name: "Guilherme Santos",
          email: 'frederico.santos@loftsdesarts.com',
          phone: '514-262-5125',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'x: 514'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('912'),
          first_name: "Serge",
          last_name: "RODRIGUEZ GONCALVES",
          email: 'serge.rodriguez@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire. Mobile: 514-922-0646'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('1612'),
          first_name: "9399-0844 Québec Inc.",
          last_name: "a/s Marco Mor",
          email: 'quebec.inc.1612@loftsdesarts.com',
          phone: '514-918-8292',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('1625'),
          first_name: "9399-0844 Québec inc.",
          last_name: "a/s Marco Mor",
          email: 'quebec.inc.1625@loftsdesarts.com',
          phone: '514-918-8292',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('PH 03'),
          first_name: "Simon",
          last_name: "Roussel",
          email: 'simon.roussel@loftsdesarts.com',
          phone: '438-492-5498',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Bureau: 514-463-8664'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('PH 04'),
          first_name: "Luc",
          last_name: "BERTHIAUME",
          email: 'luc.berthiaume@loftsdesarts.com',
          phone: '780-405-3898',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'x: 780'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('PH 05'),
          first_name: "Simon",
          last_name: "Roussel",
          email: 'simon.roussel2@loftsdesarts.com',
          phone: '438-492-5498',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('PH 05'),
          first_name: "Annick",
          last_name: "REIFER",
          email: 'annick.reifer@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Locataire. Mobile: 438-722-4577'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('PH 06'),
          first_name: "René",
          last_name: "CORMIER",
          email: 'rene.cormier@loftsdesarts.com',
          phone: '514-598-9288',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('PH 07'),
          first_name: "Anthony Ellis",
          last_name: "Plaskow",
          email: 'anthony.plaskow@loftsdesarts.com',
          phone: '447-810-5416 ext. 4',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: 'Bureau: 447-810-5416 ext. 55'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('PH 07'),
          first_name: "Daria",
          last_name: "ANIKANOVA",
          email: 'daria.anikanova@loftsdesarts.com',
          phone: '',
          is_owner: false,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'sms',
          notes: 'Locataire. Mobile: 647-680-9742'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('PH 08'),
          first_name: "Meir",
          last_name: "Rabkin",
          email: 'meir.rabkin@loftsdesarts.com',
          phone: '514-942-6347',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'en',
          preferred_notification_method: 'email',
          notes: ''
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('PH 09'),
          first_name: "Sophie",
          last_name: "Petropoulos",
          email: 'sophie.petropoulos@loftsdesarts.com',
          phone: '',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Bureau: 416-571-0885'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('PH 11'),
          first_name: "François",
          last_name: "Regnaud",
          email: 'francois.regnaud@loftsdesarts.com',
          phone: '514-248-7243',
          is_owner: true,
          is_primary_resident: true,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'email',
          notes: 'Bureau: 514-383-7825'
        },
        {
          building_id: buildingId,
          unit_id: unitMap.get('PH 11'),
          first_name: "François",
          last_name: "Trottier",
          email: 'francois.trottier@loftsdesarts.com',
          phone: '514-248-7243',
          is_owner: true,
          is_primary_resident: false,
          move_in_date: '2020-01-01',
          preferred_language: 'fr',
          preferred_notification_method: 'sms',
          notes: 'Mobile: 514-295-3066'
        }
      ];

      console.log(`Prepared ${realResidents.length} residents for import`);
      
      // Check if residents already exist to avoid duplicates
      const { data: existingResidents, error: existingError } = await supabase
        .from('residents')
        .select('*')
        .eq('building_id', buildingId);
        
      if (existingError) {
        console.error("Error checking existing residents:", existingError);
        throw existingError;
      }
      
      if (existingResidents && existingResidents.length > 0) {
        // Ask for confirmation if residents already exist
        const confirmed = window.confirm(`There are already ${existingResidents.length} residents in this building. Do you want to clear them and import new data?`);
        
        if (confirmed) {
          console.log('Deleting existing residents');
          const { error: deleteError } = await supabase
            .from('residents')
            .delete()
            .eq('building_id', buildingId);
            
          if (deleteError) {
            console.error("Error deleting existing residents:", deleteError);
            throw deleteError;
          }
        } else {
          toast({
            title: "Import Cancelled",
            description: "Import has been cancelled. No changes were made.",
          });
          return;
        }
      }
      
      // Import residents in batches to avoid timeout
      const batchSize = 5;
      const batches = [];
      
      for (let i = 0; i < realResidents.length; i += batchSize) {
        batches.push(realResidents.slice(i, i + batchSize));
      }
      
      let totalImported = 0;
      
      for (let i = 0; i < batches.length; i++) {
        console.log(`Importing batch ${i+1} of ${batches.length}`);
        const { data, error } = await supabase
          .from('residents')
          .insert(batches[i])
          .select();
          
        if (error) {
          console.error(`Error importing batch ${i+1}:`, error);
          console.error('Error details:', error?.message, error?.details, error?.hint);
          
          toast({
            title: "Erreur d'importation",
            description: `Erreur lors de l'importation du lot ${i+1}. ${error.message}`,
            variant: "destructive"
          });
          
          // Continue with next batch despite error
          continue;
        }
        
        totalImported += data?.length || 0;
      }
      
      // Refresh the residents list
      await fetchData();
      
      toast({
        title: "Données importées",
        description: `${totalImported} résidents ont été importés avec succès dans Lofts des Arts.`,
      });
      
    } catch (error: any) {
      console.error('Error importing residents:', error);
      console.error('Error details:', error?.message, error?.details, error?.hint);
      toast({
        title: "Erreur",
        description: `Impossible d'importer les résidents. ${error?.message || ''}`,
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
              
              {/* Real data import button */}
              <Button 
                variant="outline" 
                onClick={importRealResidents} 
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 border-green-300 dark:border-green-700"
              >
                Importer Données Réelles
              </Button>
              
              {/* Test data button */}
              <Button variant="outline" onClick={forceTestData} className="ml-2 bg-amber-100 dark:bg-amber-900 hover:bg-amber-200 dark:hover:bg-amber-800">
                Forcer les données de test
              </Button>
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
                  
                  {/* Bottom real data import button */}
                  <Button 
                    variant="outline" 
                    className="mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 border-green-300 dark:border-green-700"
                    onClick={importRealResidents}
                  >
                    Importer Données Réelles
                  </Button>
                  
                  {/* Bottom test button */}
                  <Button 
                    variant="outline" 
                    className="mt-2 bg-amber-100 dark:bg-amber-900 hover:bg-amber-200 dark:hover:bg-amber-800"
                    onClick={forceTestData}
                  >
                    Forcer les données de test
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b bg-muted/30">
                      <tr>
                        <th className="text-left py-2.5 px-3 font-semibold w-[22%]">Nom du résident</th>
                        <th className="text-left py-2.5 px-3 font-semibold w-[12%]">Unité</th>
                        <th className="text-left py-2.5 px-3 font-semibold w-[13%]">Statut</th>
                        <th className="text-left py-2.5 px-3 font-semibold w-[25%]">Coordonnées</th>
                        <th className="text-left py-2.5 px-3 font-semibold w-[18%]">Date d'arrivée</th>
                        <th className="text-center py-2.5 px-3 font-semibold w-[10%]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredResidents.map((resident) => (
                        <tr key={resident.id} className="hover:bg-muted/50">
                          <td className="py-2.5 px-3">
                            <div className="font-medium text-sm">{resident.first_name} {resident.last_name}</div>
                            {resident.is_primary_resident && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                Résident principal
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-medium">{resident.unit_number || 'N/A'}</div>
                            <div className="text-muted-foreground text-xs">
                              Étage {resident.floor_number || 'N/A'}
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
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
                          <td className="py-2.5 px-3">
                            <div 
                              onClick={() => {
                                toast({
                                  title: "Contact",
                                  description: `Souhaitez-vous contacter ${resident.first_name} ${resident.last_name} par email?`,
                                  action: (
                                    <div className="flex gap-2 mt-2">
                                      <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => window.open(`mailto:${resident.email}`)}
                                      >
                                        Email
                                      </Button>
                                    </div>
                                  ),
                                });
                              }}
                              className="text-primary hover:underline cursor-pointer"
                            >
                              {resident.email}
                            </div>
                            <div 
                              onClick={() => {
                                toast({
                                  title: "Contact",
                                  description: `Souhaitez-vous contacter ${resident.first_name} ${resident.last_name}?`,
                                  action: (
                                    <div className="flex gap-2 mt-2">
                                      <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => window.open(`tel:${resident.phone.replace(/-/g, '')}`)}
                                      >
                                        Appeler
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(`sms:${resident.phone.replace(/-/g, '')}`)}
                                      >
                                        SMS
                                      </Button>
                                    </div>
                                  ),
                                });
                              }}
                              className="text-muted-foreground hover:text-primary text-xs cursor-pointer mt-0.5"
                            >
                              {resident.phone}
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            {resident.move_in_date 
                              ? new Date(resident.move_in_date).toLocaleDateString('fr-CA') 
                              : 'N/A'
                            }
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 rounded"
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