import { PrismaClient } from '@prisma/client'

const units = [
  {
    unitId: 'recon_inf',
    name: 'Recon Operator',
    category: 'recon',
    class: 'infantry',
    imagePath: '../images/recon/recon_inf.png',
    description: 'Lightly armed scouts trained for stealth, surveillance, and gathering battlefield intelligence',
    stats: { health: 70, speed: 8, attackRange: 120, damage: 15, vision: 200 }
  },
  {
    unitId: 'recon_raven',
    name: 'RQ-11 Raven (USA)',
    category: 'recon',
    class: 'uav',
    imagePath: '../images/recon/recon_raven.png',
    description: 'A lightweight, man-portable UAV for short-range battlefield reconnaissance. Commonly deployed with infantry squads.',
    stats: { health: 40, speed: 12, attackRange: 0, damage: 0, vision: 250 }
  },
  {
    unitId: 'recon_puma',
    name: 'RQ-20 Puma (USA)',
    category: 'recon',
    class: 'uav',
    imagePath: '../images/recon/recon_puma.png',
    description: 'A hand-launched UAV with high endurance for tactical reconnaissance. Provides real-time battlefield awareness.',
    stats: { health: 50, speed: 10, attackRange: 0, damage: 0, vision: 300 }
  },
  {
    unitId: 'recon_heron',
    name: 'IAI Heron (Israel)',
    category: 'recon',
    class: 'uav',
    imagePath: '../images/recon/recon_heron.png',
    description: 'A long-endurance medium-altitude UAV used for reconnaissance and surveillance missions. Widely adopted by multiple countries for battlefield intelligence gathering.',
    stats: { health: 80, speed: 15, attackRange: 0, damage: 0, vision: 400 }
  },
  {
    unitId: 'recon_eagle',
    name: 'MQ-1C Gray Eagle (USA)',
    category: 'recon',
    class: 'uav',
    imagePath: '../images/recon/recon_eagle.png',
    description: 'A tactical UAV capable of both reconnaissance and light strike missions. Operated extensively by the US Army.',
    stats: { health: 90, speed: 14, attackRange: 150, damage: 25, vision: 350 }
  },
  {
    unitId: 'recon_orion',
    name: 'Orion-E (Russia)',
    category: 'recon',
    class: 'uav',
    imagePath: '../images/recon/recon_orion.png',
    description: 'A medium-altitude long-endurance UAV designed for reconnaissance, surveillance, and target acquisition.',
    stats: { health: 85, speed: 13, attackRange: 0, damage: 0, vision: 380 }
  },
  {
    unitId: 'recon_global',
    name: 'RQ-4 Global Hawk (USA)',
    category: 'recon',
    class: 'uav',
    imagePath: '../images/recon/recon_global.png',
    description: 'A high-altitude, long-endurance UAV specialized in strategic reconnaissance. Provides wide-area surveillance for extended missions.',
    stats: { health: 100, speed: 20, attackRange: 0, damage: 0, vision: 500 }
  },
  {
    unitId: 'recon_tb2',
    name: 'Bayraktar TB2 (Turkey)',
    category: 'recon',
    class: 'uav',
    imagePath: '../images/recon/recon_tb2.png',
    description: 'A medium-altitude UAV designed for reconnaissance and light attack roles. Known for its effectiveness and cost-efficiency.',
    stats: { health: 75, speed: 11, attackRange: 120, damage: 20, vision: 320 }
  },
  {
    unitId: 'recon_wingloong',
    name: 'Wing Loong II (China)',
    category: 'recon',
    class: 'uav',
    imagePath: '../images/recon/recon_wingloong.png',
    description: 'A Chinese medium-altitude UAV used for both surveillance and limited strike operations. Exported widely to allied nations.',
    stats: { health: 85, speed: 12, attackRange: 130, damage: 22, vision: 340 }
  },
  {
    unitId: 'recon_harfang',
    name: 'EADS Harfang (France/EU)',
    category: 'recon',
    class: 'uav',
    imagePath: '../images/recon/recon_harfang.png',
    description: 'A European adaptation of the Israeli Heron UAV, designed for surveillance and intelligence gathering. Used by French and NATO forces.',
    stats: { health: 80, speed: 13, attackRange: 0, damage: 0, vision: 370 }
  },
  {
    unitId: 'recon_blackjack',
    name: 'RQ-21 Blackjack (USA)',
    category: 'recon',
    class: 'uav',
    imagePath: '../images/recon/recon_blackjack.png',
    description: 'A small tactical UAV used by the US Marines and Navy. Supports naval and coastal reconnaissance operations.',
    stats: { health: 60, speed: 10, attackRange: 0, damage: 0, vision: 280 }
  },
  {
    unitId: 'recon_korshun',
    name: 'Tu-300 Korshun (Russia)',
    category: 'recon',
    class: 'uav',
    imagePath: '../images/recon/recon_korshun.png',
    description: 'A tactical reconnaissance UAV developed by Russia. Primarily used for battlefield surveillance missions.',
    stats: { health: 70, speed: 11, attackRange: 0, damage: 0, vision: 290 }
  },
  {
    unitId: 'rob_emav',
    name: 'EMAV-LW30 UGV (USA)',
    category: 'robotics',
    class: 'ground',
    imagePath: '../images/robotics/rob_emav.png',
    description: 'Expeditionary Modular Autonomous Vehicle with Light Weapon 30mm system, featuring advanced AI navigation, remote operation capability, and modular payload options for reconnaissance and fire support missions.',
    stats: { health: 250, speed: 5, attackRange: 200, damage: 40, armor: 50 }
  },
  {
    unitId: 'rob_themis',
    name: 'THEMIS UGV (Estonia)',
    category: 'robotics',
    class: 'ground',
    imagePath: '../images/robotics/rob_themis.png',
    description: 'Modular unmanned ground vehicle platform by Milrem Robotics, designed for various military applications including cargo transport, casualty evacuation, and weaponized combat support with open architecture for mission-specific modules.',
    stats: { health: 300, speed: 6, attackRange: 180, damage: 35, armor: 60 }
  },
  {
    unitId: 'inf_spet',
    name: 'Spetsnaz Operator (Russia)',
    category: 'infantry',
    class: 'special_forces',
    imagePath: '../images/infantry/infantry_spetsnaz.png',
    description: 'Elite special forces operator trained for reconnaissance, direct action, and counter-terrorism missions with expertise in unconventional warfare and advanced weapons handling.',
    stats: { health: 120, speed: 7, attackRange: 100, damage: 25, stealth: 8 }
  },
  {
    unitId: 'inf_ranger',
    name: 'US Army Rangers Operator (USA)',
    category: 'infantry',
    class: 'special_forces',
    imagePath: '../images/infantry/infantry_ranger.png',
    description: 'Elite light infantry special operations force specializing in direct action, airfield seizure, reconnaissance, and personnel recovery missions in high-risk environments.',
    stats: { health: 125, speed: 7.5, attackRange: 110, damage: 26, stealth: 7 }
  },
  {
    unitId: 'inf_sas',
    name: 'SAS Operator (UK)',
    category: 'infantry',
    class: 'special_forces',
    imagePath: '../images/infantry/infantry_sas.png',
    description: 'Elite special forces operator from the Special Air Service, specializing in counter-terrorism, hostage rescue, covert reconnaissance, and direct action missions worldwide.',
    stats: { health: 120, speed: 7.2, attackRange: 105, damage: 25, stealth: 9 }
  },
  {
    unitId: 'inf_demolition',
    name: 'USMC Demolition Operator (USA)',
    category: 'infantry',
    class: 'combat_engineer',
    imagePath: '../images/infantry/infantry_demolition.png',
    description: 'Highly trained Marine Corps combat engineer specializing in explosive ordnance disposal, vehicles destruction, and tactical demolition in support of amphibious and ground operations.',
    stats: { health: 130, speed: 6, attackRange: 80, damage: 40, explosives: 10 }
  },
  {
    unitId: 'inf_usmc',
    name: 'USMC Assault Operator (USA)',
    category: 'infantry',
    class: 'assault',
    imagePath: '../images/infantry/infantry_usmc.png',
    description: 'Marine Corps infantry specialist trained in close-quarters battle, room clearing, and direct action operations, serving as the primary assault element in amphibious and urban combat.',
    stats: { health: 140, speed: 6.5, attackRange: 90, damage: 30, courage: 8 }
  },
  {
    unitId: 'inf_force',
    name: 'USMC Force Recon (USA)',
    category: 'infantry',
    class: 'recon',
    imagePath: '../images/infantry/infantry_recon.png',
    description: 'Elite Marine Corps special operations capable unit specializing in deep reconnaissance, direct action, and advanced amphibious operations behind enemy lines.',
    stats: { health: 115, speed: 8, attackRange: 120, damage: 22, stealth: 9 }
  },
  {
    unitId: 'inf_sniper',
    name: 'USMC Scout Sniper (USA)',
    category: 'infantry',
    class: 'sniper',
    imagePath: '../images/infantry/infantry_sniper.png',
    description: 'Highly trained Marine marksmen specializing in long-range precision engagement, intelligence gathering, and providing overwatch for infantry operations in various combat environments.',
    stats: { health: 100, speed: 5.5, attackRange: 250, damage: 60, accuracy: 10 }
  },
  {
    unitId: 'inf_vdv',
    name: 'VDV Paratrooper (Russia)',
    category: 'infantry',
    class: 'airborne',
    imagePath: '../images/infantry/infantry_vdv.png',
    description: 'Elite Russian Airborne Forces operator trained for rapid deployment, air assault operations, and securing strategic objectives behind enemy lines with specialized airborne equipment.',
    stats: { health: 125, speed: 7, attackRange: 95, damage: 24, mobility: 8 }
  },
  {
    unitId: 'inf_mars3',
    name: 'PLAGF SOF with MARS 3 (China)',
    category: 'infantry',
    class: 'special_forces',
    imagePath: '../images/infantry/infantry_mars3.png',
    description: 'Elite special operations operator equipped with advanced MARS 3 integrated combat system featuring networked communications, enhanced situational awareness, and digital battlefield integration capabilities.',
    stats: { health: 130, speed: 6.8, attackRange: 115, damage: 27, tech: 9 }
  },
  {
    unitId: 'inf_hololens',
    name: 'US SOF with HoloLens (USA)',
    category: 'infantry',
    class: 'special_forces',
    imagePath: '../images/infantry/infantry_hololens.png',
    description: 'Special Operations Forces operator equipped with Microsoft HoloLens augmented reality system for enhanced situational awareness, target identification, and real-time battlefield data integration.',
    stats: { health: 120, speed: 7, attackRange: 105, damage: 24, tech: 10 }
  },
  {
    unitId: 'inf_cobra',
    name: 'COBRA Operator (Brazil)',
    category: 'infantry',
    class: 'special_forces',
    imagePath: '../images/infantry/infantry_cobra.png',
    description: 'Next-generation Brazilian special operations platform designed for integrated network-centric warfare, featuring advanced technology, real-time data sharing, and enhanced C4ISR capabilities for modern asymmetric combat environments.',
    stats: { health: 125, speed: 7.3, attackRange: 110, damage: 26, tech: 8 }
  },
  {
    unitId: 'inf_idz',
    name: 'IdZ-eS Soldier System (Germany)',
    category: 'infantry',
    class: 'future_soldier',
    imagePath: '../images/infantry/infantry_idz.png',
    description: 'Advanced German future soldier program featuring integrated networked combat systems, enhanced situational awareness, weapon interfaces, and comprehensive protective equipment for modern networked warfare.',
    stats: { health: 135, speed: 6.5, attackRange: 100, damage: 28, tech: 9 }
  },
  {
    unitId: 'inf_land125',
    name: 'LAND 125 Soldier (Australia)',
    category: 'infantry',
    class: 'future_soldier',
    imagePath: '../images/infantry/infantry_land125.png',
    description: 'LAND 125, also known as the Soldier Combat System or Project Wundurra, is the Australian Defence Force\'s program to modernize the individual infantry soldier and their squad.',
    stats: { health: 130, speed: 6.7, attackRange: 95, damage: 25, tech: 8 }
  },
  {
    unitId: 'inf_seal',
    name: 'Navy SEALs (USA)',
    category: 'infantry',
    class: 'special_forces',
    imagePath: '../images/infantry/infantry_seal.png',
    description: 'Elite U.S. Navy special warfare operators specializing in sea, air, and land missions including direct action, special reconnaissance, counter-terrorism, and unconventional warfare.',
    stats: { health: 120, speed: 7.5, attackRange: 105, damage: 26, versatility: 9 }
  },
  {
    unitId: 'pfv_kurganets',
    name: 'Kurganets-25 (Russia)',
    category: 'pfvs',
    class: 'ifv',
    imagePath: '../images/pfv/pfv_kurganets.png',
    description: 'Next-generation infantry fighting vehicle platform with modular armor, advanced weapon systems including a 57mm autocannon, and enhanced protection against modern battlefield threats.',
    stats: { health: 400, speed: 8, attackRange: 250, damage: 75, armor: 80 }
  },
  {
    unitId: 'pfv_m113',
    name: 'M113 (USA)',
    category: 'pfvs',
    class: 'apc',
    imagePath: '../images/pfv/pfv_m113.png',
    description: 'Versatile armored personnel carrier with aluminum armor, amphibious capabilities, and numerous variants used by militaries worldwide for troop transport.',
    stats: { health: 250, speed: 6.5, attackRange: 120, damage: 30, capacity: 10 }
  },
  {
    unitId: 'pfv_m2a3',
    name: 'Bradley M2A3 (USA)',
    category: 'pfvs',
    class: 'ifv',
    imagePath: '../images/pfv/pfv_m2a3.png',
    description: 'Advanced infantry fighting vehicle with digital battlefield systems, improved armor protection, 25mm Bushmaster chain gun, and TOW missile system for combined arms warfare.',
    stats: { health: 450, speed: 7.5, attackRange: 280, damage: 85, armor: 85 }
  },
  {
    unitId: 'pfv_btr82a',
    name: 'BTR-82A (Russia)',
    category: 'pfvs',
    class: 'apc',
    imagePath: '../images/pfv/pfv_82a.png',
    description: 'Modernized 8x8 wheeled armored personnel carrier with enhanced firepower, featuring a stabilized 30mm autocannon and improved protection system for urban combat operations.',
    stats: { health: 350, speed: 9, attackRange: 220, damage: 65, mobility: 8 }
  },
  {
    unitId: 'pfv_stryker',
    name: 'Stryker (USA)',
    category: 'pfvs',
    class: 'afv',
    imagePath: '../images/pfv/pfv_stryker.png',
    description: '8x8 wheeled armored combat vehicle family with multiple variants, featuring advanced C4ISR systems, modular armor protection, and high strategic mobility for rapid deployment.',
    stats: { health: 380, speed: 8.5, attackRange: 240, damage: 70, versatility: 9 }
  },
  {
    unitId: 'pfv_pandur',
    name: 'Pandur II 8x8 PFV (Czech Republic)',
    category: 'pfvs',
    class: 'afv',
    imagePath: '../images/pfv/pfv_pandur.png',
    description: 'Modular wheeled armored fighting vehicle with multiple weapon station options, including 30mm autocannon systems, designed for reconnaissance, fire support, and troop transport missions.',
    stats: { health: 320, speed: 8.2, attackRange: 230, damage: 68, modularity: 8 }
  },
  {
    unitId: 'pfv_mrap',
    name: 'MRAP All-Terrain Vehicle (USA)',
    category: 'pfvs',
    class: 'mrap',
    imagePath: '../images/pfv/pfv_mrap.png',
    description: 'Mine-Resistant Ambush Protected vehicle designed with V-shaped hull for superior blast protection, featuring advanced armor and multiple weapon station options for counter-insurgency operations.',
    stats: { health: 300, speed: 7, attackRange: 180, damage: 45, protection: 90 }
  },
  {
    unitId: 'pfv_boxer',
    name: 'Boxer APC (Germany/Netherlands)',
    category: 'pfvs',
    class: 'apc',
    imagePath: '../images/pfv/pfv_boxer.png',
    description: 'Modular 8x8 armored fighting vehicle with mission module flexibility, featuring advanced protection systems and multiple weapon configurations for various combat roles.',
    stats: { health: 420, speed: 7.8, attackRange: 260, damage: 78, modularity: 9 }
  },
  {
    unitId: 'pfv_guarani',
    name: 'VBTP-MR Guarani (Brazil)',
    category: 'pfvs',
    class: 'apc',
    imagePath: '../images/pfv/pfv_guarani.png',
    description: '6x6 wheeled armored personnel carrier with modular design, amphibious capability, and multiple weapon station options for troop transport and combat support missions.',
    stats: { health: 280, speed: 8, attackRange: 210, damage: 60, amphibious: 8 }
  },
  {
    unitId: 'pfv_kaplan',
    name: 'Kaplan-30 (Turkey/Indonesia)',
    category: 'pfvs',
    class: 'ifv',
    imagePath: '../images/pfv/pfv_kaplan.png',
    description: 'Modern medium-weight infantry fighting vehicle featuring a 30mm autocannon, anti-tank guided missiles, and advanced armor protection for enhanced battlefield survivability.',
    stats: { health: 370, speed: 7.2, attackRange: 270, damage: 80, armor: 75 }
  },
  {
    unitId: 'pfv_namer',
    name: 'Namer (Israel)',
    category: 'pfvs',
    class: 'apc',
    imagePath: '../images/pfv/pfv_namer.png',
    description: 'Heavy armored personnel carrier based on Merkava tank chassis, featuring exceptional protection levels and designed to transport infantry safely in high-threat combat environments.',
    stats: { health: 500, speed: 6, attackRange: 200, damage: 65, protection: 95 }
  },
  {
    unitId: 'pfv_vn1',
    name: 'VN-1 (China)',
    category: 'pfvs',
    class: 'apc',
    imagePath: '../images/pfv/pfv_vn1.png',
    description: '8x8 wheeled armored personnel carrier with modular design, amphibious capability, and multiple weapon configurations for troop transport and combat operations.',
    stats: { health: 330, speed: 8.3, attackRange: 225, damage: 67, amphibious: 7 }
  },
  {
    unitId: 'pfv_eitan',
    name: 'Eitan AFV (Israel)',
    category: 'pfvs',
    class: 'afv',
    imagePath: '../images/pfv/pfv_eitan.png',
    description: 'Wheeled armored fighting vehicle featuring advanced protection systems, high mobility, and modular weapon stations designed for urban combat and counter-insurgency operations.',
    stats: { health: 360, speed: 8.8, attackRange: 245, damage: 72, mobility: 9 }
  },
  {
    unitId: 'pfv_ajax',
    name: 'Ajax AFV (UK)',
    category: 'pfvs',
    class: 'afv',
    imagePath: '../images/pfv/pfv_ajax.png',
    description: 'Next-generation tracked armored fighting vehicle featuring advanced sensors, modular armor systems, and multiple variants for reconnaissance, direct fire, and engineering support roles.',
    stats: { health: 430, speed: 7, attackRange: 290, damage: 88, sensors: 9 }
  },
  {
    unitId: 'pfv_cv90',
    name: 'CV90 (Sweden)',
    category: 'pfvs',
    class: 'ifv',
    imagePath: '../images/pfv/pfv_cv90.png',
    description: 'Highly versatile infantry fighting vehicle with exceptional mobility in Nordic terrain, featuring multiple weapon configurations including 30mm or 40mm autocannons and advanced protection systems.',
    stats: { health: 410, speed: 8.5, attackRange: 275, damage: 82, mobility: 8 }
  },
  {
    unitId: 'pfv_kf41',
    name: 'Lynx KF41 (Germany)',
    category: 'pfvs',
    class: 'ifv',
    imagePath: '../images/pfv/pfv_kf41.png',
    description: 'Next-generation infantry fighting vehicle featuring modular armor, advanced sensor systems, and multiple weapon configurations including a 35mm or 50mm autocannon for enhanced lethality.',
    stats: { health: 440, speed: 7.8, attackRange: 300, damage: 90, tech: 9 }
  },
  {
    unitId: 'mbts_abrams',
    name: 'M1A2 Abrams TUSK II',
    category: 'mbt',
    class: 'main_battle_tank',
    imagePath: '../images/mbt/mbt_abrams.png',
    description: 'Advanced main battle tank featuring depleted uranium armor, 120mm smoothbore gun, and advanced fire control systems. The TUSK II variant adds urban warfare enhancements.',
    stats: { health: 800, speed: 5.5, attackRange: 400, damage: 150, armor: 95 }
  },
  {
    unitId: 'mbts_merkava',
    name: 'Merkava MK4',
    category: 'mbt',
    class: 'main_battle_tank',
    imagePath: '../images/mbt/mbt_merkava.png',
    description: 'Israeli main battle tank with unique front-engine design for crew protection, modular armor, and Trophy active protection system against anti-tank missiles.',
    stats: { health: 750, speed: 5.8, attackRange: 380, damage: 145, protection: 96 }
  },
  {
    unitId: 'mbts_pl01',
    name: 'PL-01',
    category: 'mbt',
    class: 'stealth_tank',
    imagePath: '../images/mbt/mbt_pl01.png',
    description: 'Polish stealth tank concept featuring advanced camouflage systems, modular weapon stations, and low radar signature design for modern battlefield operations.',
    stats: { health: 600, speed: 7, attackRange: 350, damage: 130, stealth: 90 }
  },
  {
    unitId: 'mbts_type99',
    name: 'Type 99/A',
    category: 'mbt',
    class: 'main_battle_tank',
    imagePath: '../images/mbt/mbt_type99.png',
    description: 'Chinese third-generation main battle tank with 125mm smoothbore gun, laser countermeasures, and advanced composite armor for modern armored warfare.',
    stats: { health: 780, speed: 6, attackRange: 390, damage: 148, armor: 92 }
  },
  {
    unitId: 'transp_chinook',
    name: 'MH-47G Chinook (USA)',
    category: 'transportation',
    class: 'helicopter',
    imagePath: '../images/transportation/transp_chinook.png',
    description: 'Heavy-lift helicopter capable of transporting troops, artillery, and vehicles in challenging environments.',
    stats: { health: 350, speed: 15, capacity: 50, range: 400, transport: 95 }
  },
  {
    unitId: 'transp_ch53',
    name: 'CH-53K Super Stallion (USA)',
    category: 'transportation',
    class: 'helicopter',
    imagePath: '../images/transportation/transp_stallion.png',
    description: 'Heavy-lift helicopter designed to transport troops, vehicles, and supplies, even in hostile environments.',
    stats: { health: 400, speed: 14, capacity: 55, range: 450, lift: 98 }
  },
  {
    unitId: 'transp_blackhawk',
    name: 'UH-60 Black Hawk (USA)',
    category: 'transportation',
    class: 'helicopter',
    imagePath: '../images/transportation/transp_hawk.png',
    description: 'Medium-lift utility helicopter used for troop transport, medical evacuation, and aerial assault missions with excellent performance in diverse environments.',
    stats: { health: 250, speed: 16, capacity: 15, range: 350, versatility: 90 }
  },
  {
    unitId: 'transp_mi17',
    name: 'Mi-17 Hip (Russia)',
    category: 'transportation',
    class: 'helicopter',
    imagePath: '../images/transportation/transp_mi17.png',
    description: 'Versatile medium-transport helicopter used for troop transport, cargo delivery, and combat support with capability to operate in extreme weather conditions.',
    stats: { health: 280, speed: 13, capacity: 30, range: 380, reliability: 85 }
  },
  {
    unitId: 'transp_nh90',
    name: 'NH90 (Multi-National)',
    category: 'transportation',
    class: 'helicopter',
    imagePath: '../images/transportation/transp_nh90.png',
    description: 'Advanced medium-sized, twin-engine multi-role military helicopter designed for troop transport, anti-submarine warfare, and search and rescue operations.',
    stats: { health: 270, speed: 15.5, capacity: 20, range: 420, tech: 88 }
  },
  {
    unitId: 'transp_v22',
    name: 'V-22 Osprey (USA)',
    category: 'transportation',
    class: 'tiltrotor',
    imagePath: '../images/transportation/transp_osprey.png',
    description: 'Multi-mission, tiltrotor military aircraft with both vertical takeoff and landing (VTOL) and short takeoff and landing (STOL) capabilities.',
    stats: { health: 320, speed: 25, capacity: 24, range: 600, speed: 95 }
  },
  {
    unitId: 'transp_aw101',
    name: 'AW101 Merlin (UK/Italy)',
    category: 'transportation',
    class: 'helicopter',
    imagePath: '../images/transportation/transp_aw101.png',
    description: 'Advanced multi-role helicopter designed for anti-submarine warfare, search and rescue, and troop transport operations in all weather conditions.',
    stats: { health: 290, speed: 14.5, capacity: 30, range: 430, all_weather: 92 }
  },
  {
    unitId: 'transp_c17',
    name: 'C-17 Globemaster III (USA)',
    category: 'transportation',
    class: 'strategic_airlift',
    imagePath: '../images/transportation/transp_c17.png',
    description: 'Large military transport aircraft capable of rapid strategic delivery of troops and cargo to main operating bases or directly to forward bases.',
    stats: { health: 500, speed: 45, capacity: 150, range: 2500, strategic: 98 }
  },
  {
    unitId: 'transp_c130',
    name: 'C-130 Hercules (USA)',
    category: 'transportation',
    class: 'tactical_airlift',
    imagePath: '../images/transportation/transp_c130.png',
    description: 'Versatile four-engine turboprop military transport aircraft capable of using unprepared runways for takeoffs and landings.',
    stats: { health: 350, speed: 35, capacity: 90, range: 2000, tactical: 95 }
  },
  {
    unitId: 'transp_c5',
    name: 'C-5 Galaxy (USA)',
    category: 'transportation',
    class: 'strategic_airlift',
    imagePath: '../images/transportation/transp_c5.png',
    description: 'Massive strategic airlifter and one of the largest military aircraft in the world, capable of carrying oversized cargo across intercontinental ranges.',
    stats: { health: 600, speed: 40, capacity: 270, range: 3000, capacity: 99 }
  },
  {
    unitId: 'transp_a400m',
    name: 'A400M Atlas (Multinational)',
    category: 'transportation',
    class: 'tactical_airlift',
    imagePath: '../images/transportation/transp_a400m.png',
    description: 'Advanced tactical and strategic airlifter with turboprop engines, capable of carrying heavy payloads and operating from rough, short airstrips.',
    stats: { health: 420, speed: 37, capacity: 120, range: 2200, versatility: 92 }
  },
  {
    unitId: 'transp_il76',
    name: 'Il-76 Candid (Russia)',
    category: 'transportation',
    class: 'strategic_airlift',
    imagePath: '../images/transportation/transp_il76.png',
    description: 'Strategic and tactical airlifter with four turbofan engines, designed for heavy lifting and capable of operating from unpaved and rough airstrips.',
    stats: { health: 380, speed: 42, capacity: 140, range: 2400, rough_field: 90 }
  },
  {
    unitId: 'transp_y20',
    name: 'Y-20 Kunpeng (China)',
    category: 'transportation',
    class: 'strategic_airlift',
    imagePath: '../images/transportation/transp_y20.png',
    description: 'Large military transport aircraft featuring advanced technologies and capable of carrying heavy payloads over long distances for strategic airlift operations.',
    stats: { health: 450, speed: 38, capacity: 130, range: 2300, tech: 85 }
  },
  {
    unitId: 'transp_an124',
    name: 'AN-124 Ruslan (Russia)',
    category: 'transportation',
    class: 'strategic_airlift',
    imagePath: '../images/transportation/transp_an124.png',
    description: 'One of the world\'s largest military transport aircraft, designed for strategic heavy airlift with massive payload capacity and a nose cargo door for efficient loading.',
    stats: { health: 550, speed: 39, capacity: 350, range: 2800, payload: 99 }
  },
  {
    unitId: 'transp_lhd',
    name: 'LHD 8 Makin Island (USA)',
    category: 'transportation',
    class: 'amphibious_assault',
    imagePath: '../images/transportation/transp_lhd.png',
    description: 'Wasp-class amphibious assault ship featuring hybrid electric propulsion, capable of carrying Marines, aircraft, and landing craft for expeditionary operations.',
    stats: { health: 1000, speed: 12, capacity: 2000, range: 5000, amphibious: 98 }
  },
  {
    unitId: 'transp_071',
    name: 'LPD Amphibious Transport Dock Type 071 Yuzhao (China)',
    category: 'transportation',
    class: 'amphibious_transport',
    imagePath: '../images/transportation/transp_071.png',
    description: 'Amphibious transport dock capable of carrying marines, vehicles, and landing craft for amphibious assault operations and humanitarian missions.',
    stats: { health: 800, speed: 14, capacity: 800, range: 4000, amphibious: 90 }
  },
  {
    unitId: 'transp_lcac',
    name: 'LCAC Hovercraft (USA)',
    category: 'transportation',
    class: 'hovercraft',
    imagePath: '../images/transportation/transp_lcac.png',
    description: 'Landing Craft Air Cushion vehicle capable of high-speed amphibious transport over water, beach, and land obstacles for rapid deployment of troops and equipment.',
    stats: { health: 200, speed: 35, capacity: 75, range: 200, amphibious: 95 }
  },
  {
    unitId: 'transp_m1070',
    name: 'Oshkosh M1070 (USA)',
    category: 'transportation',
    class: 'heavy_transporter',
    imagePath: '../images/transportation/transp_m1070.png',
    description: 'Heavy Equipment Transporter System (HETS) designed for transporting main battle tanks and other heavy armored vehicles, featuring exceptional payload capacity and off-road mobility.',
    stats: { health: 180, speed: 8, capacity: 70, range: 500, payload: 96 }
  },
  {
    unitId: 'transp_kamaz',
    name: 'KAMAZ 5350 (Russia)',
    category: 'transportation',
    class: 'military_truck',
    imagePath: '../images/transportation/transp_kamaz.png',
    description: '4x4 multipurpose military truck designed for personnel transport, cargo delivery, and equipment towing in various terrain conditions with enhanced off-road capability and reliability.',
    stats: { health: 120, speed: 10, capacity: 20, range: 600, off_road: 85 }
  },
  {
    unitId: 'transp_v280',
    name: 'Bell V-280 Valor (USA)',
    category: 'transportation',
    class: 'tiltrotor',
    imagePath: '../images/transportation/transp_v280.png',
    description: 'Third-generation tiltrotor aircraft offering enhanced speed, range, and agility for troop transport, medical evacuation, and combat support missions with significantly improved performance over conventional helicopters.',
    stats: { health: 280, speed: 28, capacity: 14, range: 500, speed: 96 }
  },
  {
    unitId: 'art_smerch',
    name: 'BM-30 Smerch (Russia)',
    category: 'artillery',
    class: 'mlrs',
    imagePath: '../images/artillery/art_smerch.png',
    description: '300mm multiple launch rocket system with 12 launch tubes, capable of delivering devastating area bombardment at ranges up to 90km.',
    stats: { health: 300, speed: 4, attackRange: 90000, damage: 200, area: 95 }
  },
  {
    unitId: 'art_himars',
    name: 'M142 HIMARS (USA)',
    category: 'artillery',
    class: 'mlrs',
    imagePath: '../images/artillery/art_himars.png',
    description: 'High Mobility Artillery Rocket System mounted on FMTV truck chassis, providing precision fire support with GPS-guided rockets and missiles.',
    stats: { health: 250, speed: 8, attackRange: 300000, damage: 180, precision: 90 }
  },
  {
    unitId: 'art_pzh2000',
    name: 'PzH 2000 (Germany)',
    category: 'artillery',
    class: 'self_propelled',
    imagePath: '../images/artillery/art_pzh2000.png',
    description: 'Advanced self-propelled howitzer with fully automatic ammunition handling, capable of firing 10 rounds per minute with high accuracy.',
    stats: { health: 320, speed: 6, attackRange: 40000, damage: 150, rate: 95 }
  },
  {
    unitId: 'art_m109',
    name: 'M109A7 Paladin (USA)',
    category: 'artillery',
    class: 'self_propelled',
    imagePath: '../images/artillery/art_m109.png',
    description: 'Latest variant of the M109 self-propelled howitzer with improved mobility, protection, and digital fire control systems.',
    stats: { health: 280, speed: 5.5, attackRange: 30000, damage: 140, reliability: 88 }
  },
  {
    unitId: 'aas_pantsir',
    name: 'Pantsir-S1 (Russia)',
    category: 'aas',
    class: 'spaag',
    imagePath: '../images/aas/aas_pantsir.png',
    description: 'Combined short to medium range surface-to-air missile and anti-aircraft artillery system mounted on a tracked chassis.',
    stats: { health: 220, speed: 5, attackRange: 20000, damage: 120, anti_air: 95 }
  },
  {
    unitId: 'aas_patriot',
    name: 'MIM-104 Patriot (USA)',
    category: 'aas',
    class: 'sam',
    imagePath: '../images/aas/aas_patriot.png',
    description: 'Long-range air defense system capable of engaging aircraft, cruise missiles, and tactical ballistic missiles.',
    stats: { health: 180, speed: 0, attackRange: 160000, damage: 180, range: 98 }
  },
  {
    unitId: 'aas_iron_dome',
    name: 'Iron Dome (Israel)',
    category: 'aas',
    class: 'c-ram',
    imagePath: '../images/aas/aas_irondome.png',
    description: 'Mobile all-weather air defense system designed to intercept and destroy short-range rockets and artillery shells.',
    stats: { health: 150, speed: 8, attackRange: 70000, damage: 100, interception: 96 }
  },
  {
    unitId: 'aas_s400',
    name: 'S-400 Triumf (Russia)',
    category: 'aas',
    class: 'sam',
    imagePath: '../images/aas/aas_s400.png',
    description: 'Long-range surface-to-air missile system capable of engaging aircraft, UAVs, and ballistic missiles at extreme ranges.',
    stats: { health: 200, speed: 0, attackRange: 400000, damage: 200, range: 99 }
  },
  {
    unitId: 'hel_apache',
    name: 'AH-64 Apache (USA)',
    category: 'helicopters',
    class: 'attack',
    imagePath: '../images/helicopters/hel_apache.png',
    description: 'Twin-turboshaft attack helicopter with nose-mounted sensor suite for target acquisition and night vision systems.',
    stats: { health: 300, speed: 18, attackRange: 8000, damage: 160, attack: 95 }
  },
  {
    unitId: 'hel_ka52',
    name: 'Ka-52 Alligator (Russia)',
    category: 'helicopters',
    class: 'attack',
    imagePath: '../images/helicopters/hel_ka52.png',
    description: 'Coaxial twin-seat attack helicopter with advanced avionics, all-weather capability, and anti-armor weapons.',
    stats: { health: 280, speed: 17, attackRange: 7500, damage: 155, agility: 90 }
  },
  {
    unitId: 'hel_mi28',
    name: 'Mi-28 Havoc (Russia)',
    category: 'helicopters',
    class: 'attack',
    imagePath: '../images/helicopters/hel_mi28.png',
    description: 'Heavy attack helicopter designed for anti-tank operations with advanced targeting systems and heavy armor protection.',
    stats: { health: 320, speed: 16, attackRange: 8500, damage: 165, armor: 88 }
  },
  {
    unitId: 'hel_tiger',
    name: 'Eurocopter Tiger (EU)',
    category: 'helicopters',
    class: 'attack',
    imagePath: '../images/helicopters/hel_tiger.png',
    description: 'Multirole attack helicopter with composite materials, advanced stealth features, and modern avionics suite.',
    stats: { health: 260, speed: 19, attackRange: 7800, damage: 150, stealth: 85 }
  },
  {
    unitId: 'fj_f35',
    name: 'F-35 Lightning II (USA)',
    category: 'fighterjets',
    class: 'multirole',
    imagePath: '../images/fighterjets/fj_f35.png',
    description: 'Fifth-generation single-seat, single-engine stealth multirole combat aircraft designed for ground-attack and air-superiority missions.',
    stats: { health: 400, speed: 65, attackRange: 100000, damage: 200, stealth: 98 }
  },
  {
    unitId: 'fj_f22',
    name: 'F-22 Raptor (USA)',
    category: 'fighterjets',
    class: 'air_superiority',
    imagePath: '../images/fighterjets/fj_f22.png',
    description: 'Fifth-generation air superiority fighter with advanced stealth, sensor fusion, and supercruise capability.',
    stats: { health: 380, speed: 70, attackRange: 120000, damage: 180, air_superiority: 99 }
  },
  {
    unitId: 'fj_su57',
    name: 'Su-57 Felon (Russia)',
    category: 'fighterjets',
    class: 'multirole',
    imagePath: '../images/fighterjets/fj_su57.png',
    description: 'Fifth-generation multirole fighter aircraft featuring stealth technology, supermaneuverability, and advanced avionics.',
    stats: { health: 390, speed: 68, attackRange: 110000, damage: 190, maneuverability: 96 }
  },
  {
    unitId: 'fj_j20',
    name: 'Chengdu J-20 (China)',
    category: 'fighterjets',
    class: 'air_superiority',
    imagePath: '../images/fighterjets/fj_j20.png',
    description: 'Fifth-generation stealth air superiority fighter with canard delta wings and advanced sensor suite for long-range engagements.',
    stats: { health: 370, speed: 66, attackRange: 105000, damage: 185, stealth: 92 }
  },
  {
    unitId: 'bom_b2',
    name: 'B-2 Spirit (USA)',
    category: 'bomber',
    class: 'stealth',
    imagePath: '../images/bomber/bom_b2.png',
    description: 'Strategic stealth bomber capable of delivering both conventional and nuclear weapons with low observable technology.',
    stats: { health: 500, speed: 55, attackRange: 11000, damage: 300, stealth: 99 }
  },
  {
    unitId: 'bom_b52',
    name: 'B-52 Stratofortress (USA)',
    category: 'bomber',
    class: 'strategic',
    imagePath: '../images/bomber/bom_b52.png',
    description: 'Long-range, subsonic strategic bomber capable of carrying large payloads of conventional and nuclear ordnance.',
    stats: { health: 450, speed: 50, attackRange: 14100, damage: 280, payload: 98 }
  },
  {
    unitId: 'bom_tu160',
    name: 'Tu-160 Blackjack (Russia)',
    category: 'bomber',
    class: 'strategic',
    imagePath: '../images/bomber/bom_tu160.png',
    description: 'Supersonic variable-sweep wing heavy strategic bomber and missile platform with intercontinental range.',
    stats: { health: 480, speed: 60, attackRange: 12300, damage: 290, speed: 95 }
  },
  {
    unitId: 'bom_tu95',
    name: 'Tu-95 Bear (Russia)',
    category: 'bomber',
    class: 'strategic',
    imagePath: '../images/bomber/bom_tu95.png',
    description: 'Large, four-engine turboprop-powered strategic bomber and missile platform with distinctive contra-rotating propellers.',
    stats: { health: 420, speed: 45, attackRange: 15000, damage: 260, range: 99 }
  },
  {
    unitId: 'des_arliegh',
    name: 'Arleigh Burke-class (USA)',
    category: 'destroyers',
    class: 'guided_missile',
    imagePath: '../images/destroyers/des_arliegh.png',
    description: 'Multi-mission guided missile destroyer equipped with Aegis Combat System for air defense, ballistic missile defense, and anti-submarine warfare.',
    stats: { health: 800, speed: 30, attackRange: 250000, damage: 350, versatility: 95 }
  },
  {
    unitId: 'des_type55',
    name: 'Type 055 (China)',
    category: 'destroyers',
    class: 'guided_missile',
    imagePath: '../images/destroyers/des_type55.png',
    description: 'Chinese guided missile destroyer featuring advanced radar systems, VLS cells, and multi-role combat capabilities.',
    stats: { health: 850, speed: 32, attackRange: 240000, damage: 340, tech: 90 }
  },
  {
    unitId: 'des_daring',
    name: 'Type 45 Daring-class (UK)',
    category: 'destroyers',
    class: 'air_defense',
    imagePath: '../images/destroyers/des_daring.png',
    description: 'Air defense destroyer equipped with Sea Viper missile system and advanced radar for fleet air defense missions.',
    stats: { health: 780, speed: 29, attackRange: 230000, damage: 320, air_defense: 96 }
  },
  {
    unitId: 'des_kolkata',
    name: 'Kolkata-class (India)',
    category: 'destroyers',
    class: 'guided_missile',
    imagePath: '../images/destroyers/des_kolkata.png',
    description: 'Stealth-guided missile destroyer featuring advanced indigenous weapon systems and sensor suites.',
    stats: { health: 820, speed: 31, attackRange: 220000, damage: 330, stealth: 85 }
  },
  {
    unitId: 'car_nimitz',
    name: 'Nimitz-class (USA)',
    category: 'carrier',
    class: 'supercarrier',
    imagePath: '../images/carrier/car_nimitz.png',
    description: 'Nuclear-powered supercarrier capable of carrying over 60 aircraft, serving as the centerpiece of carrier strike groups.',
    stats: { health: 1500, speed: 30, capacity: 90, range: 'unlimited', air_wing: 99 }
  },
  {
    unitId: 'car_ford',
    name: 'Gerald R. Ford-class (USA)',
    category: 'carrier',
    class: 'supercarrier',
    imagePath: '../images/carrier/car_ford.png',
    description: 'Latest generation of supercarriers featuring electromagnetic aircraft launch system and advanced systems automation.',
    stats: { health: 1600, speed: 32, capacity: 75, range: 'unlimited', tech: 98 }
  },
  {
    unitId: 'car_liaoning',
    name: 'Liaoning (China)',
    category: 'carrier',
    class: 'aircraft_carrier',
    imagePath: '../images/carrier/car_liaoning.png',
    description: 'Chinese aircraft carrier converted from Soviet Kuznetsov-class, serving as a training platform and power projection asset.',
    stats: { health: 1200, speed: 29, capacity: 50, range: 8000, training: 85 }
  },
  {
    unitId: 'car_queen',
    name: 'Queen Elizabeth-class (UK)',
    category: 'carrier',
    class: 'aircraft_carrier',
    imagePath: '../images/carrier/car_queen.png',
    description: 'Largest warship ever built for the Royal Navy, featuring STOVL operations for F-35B aircraft.',
    stats: { health: 1300, speed: 31, capacity: 70, range: 10000, stovl: 92 }
  }
]

export async function seedUnits(prisma: PrismaClient) {
  console.log('🌱 Inserindo unidades...')

  for (const unit of units) {
    await prisma.unit.upsert({
      where: { unitId: unit.unitId },
      update: unit,
      create: unit
    })
  }

  console.log(`✅ ${units.length} unidades inseridas`)
}
