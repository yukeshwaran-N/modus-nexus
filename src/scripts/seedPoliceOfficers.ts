import { policeOfficerService } from '../services/policeOfficerService';
import bcrypt from 'bcryptjs';

const seedOfficers = async () => {
  console.log('Seeding police officers...');
  
  const officers = [
    {
      badge_number: 'PD-1234',
      name: 'John Anderson',
      email: 'officer.anderson@police.gov',
      password: 'password',
      rank: 'Detective',
      department: 'Homicide'
    },
    {
      badge_number: 'PD-5678',
      name: 'Sarah Johnson',
      email: 'officer.johnson@police.gov',
      password: 'password',
      rank: 'Sergeant',
      department: 'Narcotics'
    },
    {
      badge_number: 'PD-9012',
      name: 'Michael Chen',
      email: 'officer.chen@police.gov',
      password: 'password',
      rank: 'Lieutenant',
      department: 'Cyber Crime'
    },
    {
      badge_number: 'PD-3456',
      name: 'Emily Rodriguez',
      email: 'officer.rodriguez@police.gov',
      password: 'password',
      rank: 'Captain',
      department: 'Internal Affairs'
    },
    {
      badge_number: 'PD-7890',
      name: 'Admin Officer',
      email: 'admin@police.gov',
      password: 'adminpassword',
      rank: 'Administrator',
      department: 'IT Department'
    }
  ];

  for (const officer of officers) {
    try {
      // Check if officer already exists
      const existingOfficer = await policeOfficerService.getOfficerByEmail(officer.email);
      
      if (existingOfficer) {
        console.log(`Officer ${officer.name} already exists, skipping...`);
        continue;
      }
      
      const result = await policeOfficerService.createOfficer(officer);
      if (result) {
        console.log(`Created officer: ${officer.name}`);
      } else {
        console.error(`Failed to create officer: ${officer.name}`);
      }
    } catch (error) {
      console.error(`Error creating officer ${officer.name}:`, error);
    }
  }
  
  console.log('Seeding completed.');
};

// Run the seed function if this script is executed directly
if (require.main === module) {
  seedOfficers()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export default seedOfficers;