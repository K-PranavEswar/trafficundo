import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { Circle, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import { Search, MapPin, Layers, Sun, Moon, Globe, ShieldCheck, XCircle, Navigation, MapIcon } from "lucide-react";

import api from "../api";
import { KERALA_DISTRICTS, formatDate } from "../constants";

/**
 * PRODUCTION NOTE: For every single small place/pincode in Kerala, maintain this 
 * index structure in a separate JSON file (e.g., `../constants/keralaPlaces.json`) 
 * and import it here. Below is a detailed, multi-district seed registry.
 */
const KERALA_LOCAL_REGISTRY = [
  // THIRUVANANTHAPURAM DISTRICT
{ name: "Thampanoor", pincode: "695001", district: "Thiruvananthapuram", coords: [8.4892, 76.9498] },
{ name: "Pattom", pincode: "695004", district: "Thiruvananthapuram", coords: [8.5237, 76.9366] },
{ name: "Kesavadasapuram", pincode: "695004", district: "Thiruvananthapuram", coords: [8.5295, 76.9441] },
{ name: "Palayam", pincode: "695034", district: "Thiruvananthapuram", coords: [8.5035, 76.9502] },
{ name: "Vazhuthacaud", pincode: "695014", district: "Thiruvananthapuram", coords: [8.5001, 76.9623] },
{ name: "Sasthamangalam", pincode: "695010", district: "Thiruvananthapuram", coords: [8.5157, 76.9664] },
{ name: "Kowdiar", pincode: "695003", district: "Thiruvananthapuram", coords: [8.5230, 76.9601] },
{ name: "Peroorkada", pincode: "695005", district: "Thiruvananthapuram", coords: [8.5358, 76.9382] },
{ name: "Poojappura", pincode: "695012", district: "Thiruvananthapuram", coords: [8.4854, 76.9736] },
{ name: "Nemom", pincode: "695020", district: "Thiruvananthapuram", coords: [8.4308, 76.9876] },
{ name: "Karamana", pincode: "695002", district: "Thiruvananthapuram", coords: [8.4769, 76.9655] },
{ name: "Thiruvallam", pincode: "695027", district: "Thiruvananthapuram", coords: [8.4524, 76.9511] },
{ name: "Vizhinjam", pincode: "695521", district: "Thiruvananthapuram", coords: [8.3786, 76.9885] },
{ name: "Kovalam", pincode: "695527", district: "Thiruvananthapuram", coords: [8.3988, 76.9785] },
{ name: "Vellarada", pincode: "695505", district: "Thiruvananthapuram", coords: [8.2453, 77.1379] },
{ name: "Balaramapuram", pincode: "695501", district: "Thiruvananthapuram", coords: [8.4235, 77.0518] },
{ name: "Neyyattinkara", pincode: "695121", district: "Thiruvananthapuram", coords: [8.4007, 77.0858] },
{ name: "Parassala", pincode: "695502", district: "Thiruvananthapuram", coords: [8.3446, 77.1473] },
{ name: "Kattakada", pincode: "695572", district: "Thiruvananthapuram", coords: [8.5116, 77.0809] },
{ name: "Nedumangad", pincode: "695541", district: "Thiruvananthapuram", coords: [8.6031, 77.0011] },
{ name: "Vembayam", pincode: "695615", district: "Thiruvananthapuram", coords: [8.6258, 76.9502] },
{ name: "Aryanad", pincode: "695542", district: "Thiruvananthapuram", coords: [8.6752, 77.0506] },
{ name: "Kallara", pincode: "695608", district: "Thiruvananthapuram", coords: [8.7103, 76.8945] },
{ name: "Attingal", pincode: "695101", district: "Thiruvananthapuram", coords: [8.6953, 76.8157] },
{ name: "Chirayinkeezhu", pincode: "695304", district: "Thiruvananthapuram", coords: [8.6582, 76.7848] },
{ name: "Varkala", pincode: "695141", district: "Thiruvananthapuram", coords: [8.7379, 76.7163] },
{ name: "Kazhakkoottam", pincode: "695582", district: "Thiruvananthapuram", coords: [8.5679, 76.8719] },
{ name: "Sreekariyam", pincode: "695017", district: "Thiruvananthapuram", coords: [8.5481, 76.9086] },
{ name: "Kaniyapuram", pincode: "695301", district: "Thiruvananthapuram", coords: [8.5884, 76.8444] },
{ name: "Mangalapuram", pincode: "695317", district: "Thiruvananthapuram", coords: [8.6171, 76.8328] },
{ name: "Manacaud", pincode: "695009", district: "Thiruvananthapuram", coords: [8.4706, 76.9548] },

// Pathanamthitta (PTA)
{ name: "Pathanamthitta", pincode: "689645", district: "Pathanamthitta", coords: [9.2648, 76.7870] },
{ name: "Adoor", pincode: "691523", district: "Pathanamthitta", coords: [9.1570, 76.7316] },
{ name: "Pandalam", pincode: "689501", district: "Pathanamthitta", coords: [9.2300, 76.6830] },
{ name: "Konni", pincode: "689691", district: "Pathanamthitta", coords: [9.2254, 76.8535] },
{ name: "Kozhencherry", pincode: "689641", district: "Pathanamthitta", coords: [9.3373, 76.7067] },
{ name: "Ranni", pincode: "689672", district: "Pathanamthitta", coords: [9.3797, 76.8155] },
{ name: "Thiruvalla", pincode: "689101", district: "Pathanamthitta", coords: [9.3835, 76.5740] },
{ name: "Kumbanad", pincode: "689547", district: "Pathanamthitta", coords: [9.3410, 76.6410] },
{ name: "Mallappally", pincode: "689585", district: "Pathanamthitta", coords: [9.4310, 76.6920] },
{ name: "Parumala", pincode: "689626", district: "Pathanamthitta", coords: [9.3325, 76.5203] },
{ name: "Niranam", pincode: "689621", district: "Pathanamthitta", coords: [9.3518, 76.5391] },
{ name: "Aranmula", pincode: "689533", district: "Pathanamthitta", coords: [9.3274, 76.6842] },
{ name: "Elanthoor", pincode: "689643", district: "Pathanamthitta", coords: [9.2745, 76.7425] },
{ name: "Omalloor", pincode: "689647", district: "Pathanamthitta", coords: [9.2890, 76.7545] },
{ name: "Kulanada", pincode: "689503", district: "Pathanamthitta", coords: [9.1886, 76.6981] },
{ name: "Kodumon", pincode: "691555", district: "Pathanamthitta", coords: [9.1808, 76.8244] },
{ name: "Mylapra", pincode: "689678", district: "Pathanamthitta", coords: [9.2438, 76.8194] },
{ name: "Seethathode", pincode: "689667", district: "Pathanamthitta", coords: [9.4548, 76.9556] },
{ name: "Perunad", pincode: "689711", district: "Pathanamthitta", coords: [9.4325, 76.9842] },
{ name: "Vadasserikkara", pincode: "689662", district: "Pathanamthitta", coords: [9.4093, 76.8581] },
{ name: "Cherukole", pincode: "691551", district: "Pathanamthitta", coords: [9.2382, 76.8351] },
{ name: "Kallooppara", pincode: "689583", district: "Pathanamthitta", coords: [9.4045, 76.6208] },
{ name: "Nedumpuram", pincode: "689578", district: "Pathanamthitta", coords: [9.3694, 76.6035] },
{ name: "Pullad", pincode: "689548", district: "Pathanamthitta", coords: [9.3627, 76.6488] },
{ name: "Kadammanitta", pincode: "689649", district: "Pathanamthitta", coords: [9.2876, 76.8427] },
{ name: "Thannithode", pincode: "689699", district: "Pathanamthitta", coords: [9.3228, 76.9316] },
{ name: "Chittar", pincode: "689663", district: "Pathanamthitta", coords: [9.3437, 76.9695] },
{ name: "Athikayam", pincode: "689711", district: "Pathanamthitta", coords: [9.4558, 76.9154] },
{ name: "Vechoochira", pincode: "686511", district: "Pathanamthitta", coords: [9.4484, 76.8831] },
{ name: "Eraviperoor", pincode: "689542", district: "Pathanamthitta", coords: [9.3764, 76.6227] },

// Ernakulam (EKM)
{ name: "Aluva", pincode: "683101", district: "Ernakulam", coords: [10.1076, 76.3504] },
{ name: "Angamaly", pincode: "683572", district: "Ernakulam", coords: [10.1906, 76.3870] },
{ name: "Edappally", pincode: "682024", district: "Ernakulam", coords: [10.0261, 76.3088] },
{ name: "Vyttila", pincode: "682019", district: "Ernakulam", coords: [9.9658, 76.3204] },
{ name: "Kakkanad", pincode: "682030", district: "Ernakulam", coords: [10.0159, 76.3419] },
{ name: "Kaloor", pincode: "682017", district: "Ernakulam", coords: [9.9981, 76.2915] },
{ name: "Palarivattom", pincode: "682025", district: "Ernakulam", coords: [10.0032, 76.3069] },
{ name: "Fort Kochi", pincode: "682001", district: "Ernakulam", coords: [9.9667, 76.2425] },
{ name: "Mattancherry", pincode: "682002", district: "Ernakulam", coords: [9.9585, 76.2598] },
{ name: "Marine Drive", pincode: "682031", district: "Ernakulam", coords: [9.9816, 76.2766] },
{ name: "Tripunithura", pincode: "682301", district: "Ernakulam", coords: [9.9497, 76.3441] },
{ name: "Thrippunithura Hill Palace", pincode: "682301", district: "Ernakulam", coords: [9.9514, 76.3557] },
{ name: "Perumbavoor", pincode: "683542", district: "Ernakulam", coords: [10.1069, 76.4737] },
{ name: "Muvattupuzha", pincode: "686661", district: "Ernakulam", coords: [9.9874, 76.5822] },
{ name: "Kothamangalam", pincode: "686691", district: "Ernakulam", coords: [10.0644, 76.6294] },
{ name: "Piravom", pincode: "686664", district: "Ernakulam", coords: [9.8669, 76.4928] },
{ name: "North Paravur", pincode: "683513", district: "Ernakulam", coords: [10.1427, 76.2248] },
{ name: "Cherai", pincode: "683514", district: "Ernakulam", coords: [10.1420, 76.1784] },
{ name: "Kodungallur Road Junction", pincode: "683520", district: "Ernakulam", coords: [10.1584, 76.2089] },
{ name: "Kalamassery", pincode: "683104", district: "Ernakulam", coords: [10.0535, 76.3131] },
{ name: "Eloor", pincode: "683501", district: "Ernakulam", coords: [10.0734, 76.2868] },
{ name: "Maradu", pincode: "682304", district: "Ernakulam", coords: [9.9435, 76.3287] },
{ name: "Thevara", pincode: "682013", district: "Ernakulam", coords: [9.9538, 76.2895] },
{ name: "Panampilly Nagar", pincode: "682036", district: "Ernakulam", coords: [9.9672, 76.2948] },
{ name: "Kadavanthra", pincode: "682020", district: "Ernakulam", coords: [9.9778, 76.2996] },
{ name: "Chembumukku", pincode: "682030", district: "Ernakulam", coords: [10.0250, 76.3500] },
{ name: "Infopark", pincode: "682042", district: "Ernakulam", coords: [10.0150, 76.3640] },
{ name: "SmartCity", pincode: "682042", district: "Ernakulam", coords: [10.0085, 76.3648] },
{ name: "Aroor", pincode: "688534", district: "Ernakulam", coords: [9.8697, 76.3047] },
{ name: "Mulavukad", pincode: "682504", district: "Ernakulam", coords: [10.0238, 76.2489] },
{ name: "Thrippunithura", pincode: "682301", district: "Ernakulam", coords: [10.0283, 76.3115] },

// Kozhikode (CLT)
{ name: "Kozhikode", pincode: "673001", district: "Kozhikode", coords: [11.2588, 75.7804] },
{ name: "Mananchira", pincode: "673001", district: "Kozhikode", coords: [11.2534, 75.7804] },
{ name: "Mavoor", pincode: "673661", district: "Kozhikode", coords: [11.2655, 75.9392] },
{ name: "Thamarassery", pincode: "673573", district: "Kozhikode", coords: [11.4152, 75.9348] },
{ name: "Vadakara", pincode: "673101", district: "Kozhikode", coords: [11.6085, 75.5811] },
{ name: "Koyilandy", pincode: "673305", district: "Kozhikode", coords: [11.4397, 75.6966] },
{ name: "Ramanattukara", pincode: "673633", district: "Kozhikode", coords: [11.1747, 75.8674] },
{ name: "Feroke", pincode: "673631", district: "Kozhikode", coords: [11.1798, 75.8414] },
{ name: "Beypore", pincode: "673015", district: "Kozhikode", coords: [11.1718, 75.8040] },
{ name: "Kunnamangalam", pincode: "673571", district: "Kozhikode", coords: [11.3045, 75.8777] },
{ name: "Balussery", pincode: "673612", district: "Kozhikode", coords: [11.4534, 75.8114] },
{ name: "Perambra", pincode: "673525", district: "Kozhikode", coords: [11.5635, 75.7386] },
{ name: "Mukkom", pincode: "673602", district: "Kozhikode", coords: [11.3217, 75.9962] },
{ name: "Koduvally", pincode: "673572", district: "Kozhikode", coords: [11.3553, 75.9188] },
{ name: "Nadakkavu", pincode: "673011", district: "Kozhikode", coords: [11.2712, 75.7747] },
{ name: "West Hill", pincode: "673005", district: "Kozhikode", coords: [11.2864, 75.7557] },
{ name: "Medical College", pincode: "673008", district: "Kozhikode", coords: [11.2722, 75.8364] },
{ name: "Chevayur", pincode: "673017", district: "Kozhikode", coords: [11.2745, 75.8128] },
{ name: "Pantheerankavu", pincode: "673019", district: "Kozhikode", coords: [11.2269, 75.8578] },
{ name: "Elathur", pincode: "673303", district: "Kozhikode", coords: [11.3475, 75.7394] },
{ name: "Payyoli", pincode: "673522", district: "Kozhikode", coords: [11.5488, 75.6182] },
{ name: "Kappad", pincode: "673304", district: "Kozhikode", coords: [11.3817, 75.7220] },
{ name: "Atholi", pincode: "673315", district: "Kozhikode", coords: [11.4308, 75.7424] },
{ name: "Narikkuni", pincode: "673585", district: "Kozhikode", coords: [11.3507, 75.8589] },
{ name: "Omassery", pincode: "673582", district: "Kozhikode", coords: [11.4002, 75.9764] },
{ name: "Chathamangalam", pincode: "673601", district: "Kozhikode", coords: [11.3131, 75.9122] },
{ name: "Kakkodi", pincode: "673611", district: "Kozhikode", coords: [11.3167, 75.8333] },
{ name: "Vellimadukunnu", pincode: "673012", district: "Kozhikode", coords: [11.2901, 75.8218] },
{ name: "NIT Calicut", pincode: "673601", district: "Kozhikode", coords: [11.3216, 75.9348] },
{ name: "Engapuzha", pincode: "673586", district: "Kozhikode", coords: [11.4722, 75.9495] },
{ name: "Kunnuparamba", pincode: "673571", district: "Kozhikode", coords: [11.3100, 75.8900] },
{ name: "Vengalam", pincode: "673571", district: "Kozhikode", coords: [11.3200, 75.8700] },
{ name: "Pantheerankavu", pincode: "673019", district: "Kozhikode", coords: [11.2269, 75.8578] },
{ name: "Kozhikode Beach", pincode: "673001", district: "Kozhikode", coords: [11.2580, 75.7800] },
{ name: "Mananchira Square", pincode: "673001", district: "Kozhikode", coords: [11.2534, 75.7804] },
{ name: "Calicut University", pincode: "673635", district: "Kozhikode", coords: [11.3175, 75.9350] },
{ name: "Kozhikode Railway Station", pincode: "673001", district: "Kozhikode", coords: [11.2590, 75.7810] },
{ name: "Mavoor Road", pincode: "673661", district: "Kozhikode", coords: [11.2655, 75.9392] },
// Idukki (IDK)
{ name: "Munnar", pincode: "685612", district: "Idukki", coords: [10.0889, 77.0595] },
{ name: "Kattappana", pincode: "685508", district: "Idukki", coords: [9.7224, 77.1171] },
{ name: "Nedumkandam", pincode: "685553", district: "Idukki", coords: [9.8322, 77.1687] },
{ name: "Thodupuzha", pincode: "685584", district: "Idukki", coords: [9.8972, 76.7180] },
{ name: "Adimali", pincode: "685561", district: "Idukki", coords: [10.0159, 76.9825] },
{ name: "Kumily", pincode: "685509", district: "Idukki", coords: [9.6050, 77.1600] },
{ name: "Thekkady", pincode: "685536", district: "Idukki", coords: [9.5952, 77.1809] },
{ name: "Vandiperiyar", pincode: "685533", district: "Idukki", coords: [9.5667, 77.1333] },
{ name: "Peermade", pincode: "685531", district: "Idukki", coords: [9.5750, 76.9900] },
{ name: "Cheruthoni", pincode: "685602", district: "Idukki", coords: [9.8488, 76.9690] },
{ name: "Painavu", pincode: "685603", district: "Idukki", coords: [9.8518, 76.9684] },
{ name: "Idukki Township", pincode: "685602", district: "Idukki", coords: [9.8496, 76.9751] },
{ name: "Rajakkad", pincode: "685566", district: "Idukki", coords: [9.9997, 77.0933] },
{ name: "Rajakumari", pincode: "685619", district: "Idukki", coords: [10.0160, 77.1180] },
{ name: "Udumbanchola", pincode: "685554", district: "Idukki", coords: [9.8667, 77.1500] },
{ name: "Vathikudy", pincode: "685604", district: "Idukki", coords: [9.9333, 76.9167] },
{ name: "Vagamon", pincode: "685503", district: "Idukki", coords: [9.6866, 76.9058] },
{ name: "Murickassery", pincode: "685604", district: "Idukki", coords: [9.9500, 76.9833] },
{ name: "Kanjar", pincode: "685592", district: "Idukki", coords: [9.8167, 76.7833] },
{ name: "Moolamattom", pincode: "685589", district: "Idukki", coords: [9.8500, 76.8333] },
{ name: "Karimannoor", pincode: "685581", district: "Idukki", coords: [9.8667, 76.7667] },
{ name: "Vannappuram", pincode: "685607", district: "Idukki", coords: [9.9500, 76.8167] },
{ name: "Devikulam", pincode: "685613", district: "Idukki", coords: [10.0627, 77.1067] },
{ name: "Poopara", pincode: "685619", district: "Idukki", coords: [10.0315, 77.1342] },
{ name: "Bison Valley", pincode: "685565", district: "Idukki", coords: [10.0525, 77.0420] },
{ name: "Anakkara", pincode: "685512", district: "Idukki", coords: [9.6833, 77.0833] },
{ name: "Chinnakanal", pincode: "685618", district: "Idukki", coords: [10.0217, 77.1895] },
{ name: "Santhanpara", pincode: "685619", district: "Idukki", coords: [10.0038, 77.2013] },
{ name: "Elappara", pincode: "685501", district: "Idukki", coords: [9.5500, 76.9667] },
{ name: "Peruvanthanam", pincode: "685532", district: "Idukki", coords: [9.5833, 76.9500] },

// Wayanad (WYD)
{ name: "Kalpetta", pincode: "673121", district: "Wayanad", coords: [11.6052, 76.0831] },
{ name: "Sulthan Bathery", pincode: "673592", district: "Wayanad", coords: [11.6661, 76.2572] },
{ name: "Mananthavady", pincode: "670645", district: "Wayanad", coords: [11.8032, 76.0036] },
{ name: "Meppadi", pincode: "673577", district: "Wayanad", coords: [11.5500, 76.1333] },
{ name: "Vythiri", pincode: "673576", district: "Wayanad", coords: [11.5508, 76.0528] },
{ name: "Ambalavayal", pincode: "673593", district: "Wayanad", coords: [11.6200, 76.2050] },
{ name: "Panamaram", pincode: "670721", district: "Wayanad", coords: [11.7408, 76.0734] },
{ name: "Pulpally", pincode: "673579", district: "Wayanad", coords: [11.8068, 76.1235] },
{ name: "Pozhuthana", pincode: "673575", district: "Wayanad", coords: [11.5762, 76.0851] },
{ name: "Padinjarathara", pincode: "673575", district: "Wayanad", coords: [11.7706, 75.9841] },
{ name: "Muttil", pincode: "673122", district: "Wayanad", coords: [11.6502, 76.0448] },
{ name: "Kaniyambetta", pincode: "673124", district: "Wayanad", coords: [11.6301, 76.0709] },
{ name: "Thariode", pincode: "673575", district: "Wayanad", coords: [11.7050, 75.9970] },
{ name: "Kottathara", pincode: "673123", district: "Wayanad", coords: [11.6958, 76.0144] },
{ name: "Nenmeni", pincode: "673592", district: "Wayanad", coords: [11.6952, 76.2773] },
{ name: "Muppainad", pincode: "673577", district: "Wayanad", coords: [11.5340, 76.1207] },
{ name: "Chundale", pincode: "673123", district: "Wayanad", coords: [11.6508, 76.0245] },
{ name: "Kambalakkad", pincode: "673121", district: "Wayanad", coords: [11.6907, 76.0896] },
{ name: "Cheeral", pincode: "673595", district: "Wayanad", coords: [11.6651, 76.3574] },
{ name: "Noolpuzha", pincode: "673592", district: "Wayanad", coords: [11.6957, 76.3634] },
{ name: "Kalloor", pincode: "673122", district: "Wayanad", coords: [11.6390, 76.0560] },
{ name: "Kappiset", pincode: "673576", district: "Wayanad", coords: [11.5652, 76.0284] },
{ name: "Lakkidi", pincode: "673576", district: "Wayanad", coords: [11.5164, 76.0276] },
{ name: "Pookode", pincode: "673576", district: "Wayanad", coords: [11.5452, 76.0265] },
{ name: "Tholpetty", pincode: "670646", district: "Wayanad", coords: [11.9103, 76.0271] },
{ name: "Bavali", pincode: "670646", district: "Wayanad", coords: [11.9178, 76.1012] },
{ name: "Valliyoorkavu", pincode: "670645", district: "Wayanad", coords: [11.7834, 76.0173] },
{ name: "Tirunelli", pincode: "670646", district: "Wayanad", coords: [11.9247, 75.9943] },
{ name: "Moolankavu", pincode: "673592", district: "Wayanad", coords: [11.6612, 76.3015] },
{ name: "Beenachi", pincode: "673592", district: "Wayanad", coords: [11.6458, 76.2694] },
// Thrissur (TCR)
{ name: "Thrissur", pincode: "680001", district: "Thrissur", coords: [10.5276, 76.2144] },
{ name: "Swaraj Round", pincode: "680001", district: "Thrissur", coords: [10.5244, 76.2144] },
{ name: "Punkunnam", pincode: "680002", district: "Thrissur", coords: [10.5361, 76.1927] },
{ name: "Ayyanthole", pincode: "680003", district: "Thrissur", coords: [10.5208, 76.1956] },
{ name: "Ollur", pincode: "680306", district: "Thrissur", coords: [10.4879, 76.2335] },
{ name: "Mannuthy", pincode: "680651", district: "Thrissur", coords: [10.5270, 76.2890] },
{ name: "Puthur", pincode: "680014", district: "Thrissur", coords: [10.5605, 76.2508] },
{ name: "Kodakara", pincode: "680684", district: "Thrissur", coords: [10.3267, 76.3704] },
{ name: "Chalakudy", pincode: "680307", district: "Thrissur", coords: [10.3121, 76.3344] },
{ name: "Koratty", pincode: "680308", district: "Thrissur", coords: [10.2855, 76.3498] },
{ name: "Mala", pincode: "680732", district: "Thrissur", coords: [10.2924, 76.2418] },
{ name: "Kodungallur", pincode: "680664", district: "Thrissur", coords: [10.2326, 76.1951] },
{ name: "Irinjalakuda", pincode: "680121", district: "Thrissur", coords: [10.3424, 76.2112] },
{ name: "Kattoor", pincode: "680702", district: "Thrissur", coords: [10.2860, 76.1750] },
{ name: "Mathilakam", pincode: "680685", district: "Thrissur", coords: [10.2506, 76.1725] },
{ name: "Guruvayur", pincode: "680101", district: "Thrissur", coords: [10.5946, 76.0375] },
{ name: "Chavakkad", pincode: "680506", district: "Thrissur", coords: [10.5825, 76.0414] },
{ name: "Kunnamkulam", pincode: "680503", district: "Thrissur", coords: [10.6467, 76.0716] },
{ name: "Wadakkanchery", pincode: "680582", district: "Thrissur", coords: [10.6518, 76.2326] },
{ name: "Chelakkara", pincode: "680586", district: "Thrissur", coords: [10.6925, 76.3430] },
{ name: "Pazhayannur", pincode: "680587", district: "Thrissur", coords: [10.6831, 76.3207] },
{ name: "Kechery", pincode: "680501", district: "Thrissur", coords: [10.6500, 76.1333] },
{ name: "Cherpu", pincode: "680561", district: "Thrissur", coords: [10.4065, 76.1604] },
{ name: "Anthikad", pincode: "680641", district: "Thrissur", coords: [10.3901, 76.1287] },
{ name: "Pavaratty", pincode: "680507", district: "Thrissur", coords: [10.5668, 76.0702] },
{ name: "Engandiyur", pincode: "680615", district: "Thrissur", coords: [10.5214, 76.0518] },
{ name: "Valapad", pincode: "680567", district: "Thrissur", coords: [10.4397, 76.0862] },
{ name: "Kaipamangalam", pincode: "680681", district: "Thrissur", coords: [10.2778, 76.1301] },
{ name: "Athani", pincode: "680771", district: "Thrissur", coords: [10.4476, 76.2472] },
{ name: "Peringavu", pincode: "680018", district: "Thrissur", coords: [10.5056, 76.2042] },
  
// Palakkad (PKD)
{ name: "Palakkad", pincode: "678001", district: "Palakkad", coords: [10.7867, 76.6548] },
{ name: "Ottapalam", pincode: "679101", district: "Palakkad", coords: [10.7749, 76.3837] },
{ name: "Alathur", pincode: "678541", district: "Palakkad", coords: [10.6433, 76.5441] },
{ name: "Shoranur", pincode: "679121", district: "Palakkad", coords: [10.7618, 76.2705] },
{ name: "Mannarkkad", pincode: "678582", district: "Palakkad", coords: [10.9925, 76.4617] },
{ name: "Pattambi", pincode: "679303", district: "Palakkad", coords: [10.8054, 76.1963] },
{ name: "Cherpulassery", pincode: "679503", district: "Palakkad", coords: [10.8794, 76.3098] },
{ name: "Kongad", pincode: "678631", district: "Palakkad", coords: [10.8105, 76.6530] },
{ name: "Koduvayur", pincode: "678501", district: "Palakkad", coords: [10.7048, 76.7431] },
{ name: "Chittur", pincode: "678101", district: "Palakkad", coords: [10.6991, 76.7477] },
{ name: "Nenmara", pincode: "678508", district: "Palakkad", coords: [10.5948, 76.6908] },
{ name: "Kollengode", pincode: "678506", district: "Palakkad", coords: [10.5836, 76.6881] },
{ name: "Kuzhalmannam", pincode: "678702", district: "Palakkad", coords: [10.7065, 76.5662] },
{ name: "Parli", pincode: "678612", district: "Palakkad", coords: [10.8150, 76.6658] },
{ name: "Walayar", pincode: "678624", district: "Palakkad", coords: [10.8422, 76.8605] },
{ name: "Kanjikode", pincode: "678621", district: "Palakkad", coords: [10.8217, 76.6938] },
{ name: "Malampuzha", pincode: "678651", district: "Palakkad", coords: [10.8378, 76.6933] },
{ name: "Mundur", pincode: "678592", district: "Palakkad", coords: [10.8261, 76.5558] },
{ name: "Agali", pincode: "678581", district: "Palakkad", coords: [11.0562, 76.6554] },
{ name: "Attappady", pincode: "678581", district: "Palakkad", coords: [11.0167, 76.6333] },
{ name: "Mankara", pincode: "678613", district: "Palakkad", coords: [10.8033, 76.6204] },
{ name: "Pirayiri", pincode: "678004", district: "Palakkad", coords: [10.7771, 76.6732] },
{ name: "Lakkidi", pincode: "679301", district: "Palakkad", coords: [10.8017, 76.1773] },
{ name: "Thrithala", pincode: "679534", district: "Palakkad", coords: [10.7482, 76.1263] },
{ name: "Anakkara", pincode: "679551", district: "Palakkad", coords: [10.8426, 76.1434] },
{ name: "Peringode", pincode: "679535", district: "Palakkad", coords: [10.7811, 76.1418] },
{ name: "Koppam", pincode: "679307", district: "Palakkad", coords: [10.8406, 76.1657] },
{ name: "Alanallur", pincode: "678601", district: "Palakkad", coords: [11.0356, 76.3958] },
{ name: "Sreekrishnapuram", pincode: "679513", district: "Palakkad", coords: [10.8924, 76.3407] },
{ name: "Parambikulam", pincode: "678661", district: "Palakkad", coords: [10.3941, 76.7907] },
{ name: "Pattambi", pincode: "678614", district: "Palakkad", coords: [10.825, 76.6139] },
{ name: "Pattukkottai", pincode: "678614", district: "Palakkad", coords: [10.825, 76.6139] },
{ name: "Mannargudi", pincode: "678614", district: "Palakkad", coords: [10.825, 76.6139] },
{ name: "Pudukkottai", pincode: "678614", district: "Palakkad", coords: [10.825, 76.6139] },

// Alappuzha (ALP)
{ name: "Alappuzha", pincode: "688001", district: "Alappuzha", coords: [9.4981, 76.3388] },
{ name: "Kuttanad", pincode: "688561", district: "Alappuzha", coords: [9.4312, 76.4163] },
{ name: "Cherthala", pincode: "688524", district: "Alappuzha", coords: [9.6841, 76.3312] },
{ name: "Ambalappuzha", pincode: "688561", district: "Alappuzha", coords: [9.3847, 76.3569] },
{ name: "Haripad", pincode: "690514", district: "Alappuzha", coords: [9.2824, 76.4631] },
{ name: "Kayamkulam", pincode: "690502", district: "Alappuzha", coords: [9.1818, 76.5002] },
{ name: "Mavelikkara", pincode: "690101", district: "Alappuzha", coords: [9.2593, 76.5564] },
{ name: "Chengannur", pincode: "689121", district: "Alappuzha", coords: [9.3157, 76.6151] },
{ name: "Aroor", pincode: "688534", district: "Alappuzha", coords: [9.8697, 76.3047] },
{ name: "Thuravoor", pincode: "688532", district: "Alappuzha", coords: [9.7688, 76.3435] },
{ name: "Mararikulam", pincode: "688523", district: "Alappuzha", coords: [9.6185, 76.2995] },
{ name: "Mannancherry", pincode: "688538", district: "Alappuzha", coords: [9.5492, 76.3504] },
{ name: "Punnapra", pincode: "688004", district: "Alappuzha", coords: [9.5208, 76.3214] },
{ name: "Aryad", pincode: "688006", district: "Alappuzha", coords: [9.4688, 76.3212] },
{ name: "Muhamma", pincode: "688525", district: "Alappuzha", coords: [9.6408, 76.3872] },
{ name: "Kumarakom Boat Jetty", pincode: "688503", district: "Alappuzha", coords: [9.6035, 76.4291] },
{ name: "Nedumudi", pincode: "688508", district: "Alappuzha", coords: [9.4428, 76.3948] },
{ name: "Pulinkunnu", pincode: "688504", district: "Alappuzha", coords: [9.4384, 76.4017] },
{ name: "Champakulam", pincode: "688505", district: "Alappuzha", coords: [9.4037, 76.3985] },
{ name: "Edathua", pincode: "689573", district: "Alappuzha", coords: [9.3732, 76.4427] },
{ name: "Moncompu", pincode: "688502", district: "Alappuzha", coords: [9.4451, 76.4238] },
{ name: "Thakazhy", pincode: "688562", district: "Alappuzha", coords: [9.3721, 76.4208] },
{ name: "Veliyanad", pincode: "688590", district: "Alappuzha", coords: [9.4872, 76.4335] },
{ name: "Kainakary", pincode: "688501", district: "Alappuzha", coords: [9.4521, 76.3829] },
{ name: "Chettikulangara", pincode: "690106", district: "Alappuzha", coords: [9.2315, 76.5152] },
{ name: "Nooranad", pincode: "690504", district: "Alappuzha", coords: [9.2086, 76.6138] },
{ name: "Bharanikkavu", pincode: "690503", district: "Alappuzha", coords: [9.1664, 76.5628] },
{ name: "Muthukulam", pincode: "690506", district: "Alappuzha", coords: [9.2207, 76.4542] },
{ name: "Pallippad", pincode: "690512", district: "Alappuzha", coords: [9.3178, 76.4768] },
{ name: "Karuvatta", pincode: "690517", district: "Alappuzha", coords: [9.3034, 76.4309] }
];

const DISTRICT_CENTERS = {
  "Thiruvananthapuram": [8.5241, 76.9366],
  "Kollam": [8.8932, 76.6141],
  "Pathanamthitta": [9.2648, 76.7870],
  "Alappuzha": [9.4981, 76.3388],
  "Kottayam": [9.5916, 76.5222],
  "Idukki": [9.8500, 76.9492],
  "Ernakulam": [9.9816, 76.2999],
  "Thrissur": [10.5276, 76.2144],
  "Palakkad": [10.7867, 76.6548],
  "Malappuram": [11.0732, 76.0740],
  "Kozhikode": [11.2588, 75.7804],
  "Wayanad": [11.6854, 76.1320],
  "Kannur": [11.8745, 75.3704],
  "Kasaragod": [12.4996, 74.9869],
};

const MAP_STYLES = {
  light: { name: "Street View", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: '&copy; OpenStreetMap', icon: <Sun className="h-4 w-4" /> },
  dark: { name: "Dark Mode", url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", attribution: '&copy; OpenStreetMap & CartoDB', icon: <Moon className="h-4 w-4" /> },
  satellite: { name: "Satellite", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attribution: 'Tiles &copy; Esri', icon: <Globe className="h-4 w-4" /> }
};

const blockIcon = L.divIcon({
  className: "bg-transparent border-none",
  html: '<div class="flex items-center justify-center w-8 h-8 bg-rose-600 rounded-full border-2 border-white shadow-md text-white font-black animate-bounce">!</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function FlyToLocation({ center, zoom = 14 }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

function TrafficMap({ reportsVersion, settings, user }) {
  const [reports, setReports] = useState([]);
  const [district, setDistrict] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Custom states for handling the map perspective shifts
  const [mapStyle, setMapStyle] = useState("light");
  const [mapCenter, setMapCenter] = useState([8.4524, 76.9511]); // Defaults right over Thiruvallam, TVM
  const [mapZoom, setMapZoom] = useState(13);

  // Computed live search dropdown list for local places & pin codes
  const filteredLocalPlaces = useMemo(() => {
    if (!search || search.length < 2) return [];
    const term = search.toLowerCase();
    return KERALA_LOCAL_REGISTRY.filter(
      place => place.name.toLowerCase().includes(term) || place.pincode.includes(term)
    ).slice(0, 5); // Limit dropdown to top 5 hits
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await api.get("/reports", {
          params: { district: district || undefined, search: search || undefined },
        });
        if (!cancelled) {
          setReports(response.data);
          setError("");
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error || "Unable to load reports.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchReports();
    return () => { cancelled = true; };
  }, [district, reportsVersion, search]);

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setDistrict(selectedDistrict);
    if (selectedDistrict && DISTRICT_CENTERS[selectedDistrict]) {
      setMapCenter(DISTRICT_CENTERS[selectedDistrict]);
      setMapZoom(11);
    }
  };

  const jumpToLocalPlace = (place) => {
    setMapCenter(place.coords);
    setMapZoom(15); // Deep street level look zoom
    setSearch(`${place.pincode} - ${place.name} (${place.district})`);
    setDistrict(place.district);
  };

  const activeReports = reports.filter((report) => report.status === "Active");

  return (
    <section className="animate-fade-in pb-10 max-w-screen-2xl mx-auto px-4 md:px-6">
      <div className="mb-6">
        <p className="text-cyan-600 font-bold tracking-wider uppercase text-xs md:text-sm mb-1 flex items-center gap-2">
          <Navigation className="h-4 w-4" /> Smart-City Navigation Engine
        </p>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">
          Live Kerala Traffic Map
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
          Enter any micro-locality name or 6-digit Pincode to isolate local hazard blocks instantly.
        </p>
      </div>

      {/* Advanced Filter with Live Autocomplete dropdown layer */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center glass-panel p-4 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 relative z-[1000]">
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto relative">
          <select 
            className="w-full sm:w-48 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 font-bold outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white appearance-none text-sm" 
            value={district} 
            onChange={handleDistrictChange}
          >
            <option value="">All Districts</option>
            {KERALA_DISTRICTS.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          
          {/* Smart Locality Input Field */}
          <div className="relative w-full sm:w-80 md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 font-semibold outline-none focus:ring-2 focus:ring-cyan-500 dark:border-white/10 dark:bg-slate-800 dark:text-white text-sm" 
              placeholder="Type Pincode (e.g. 695027) or Local Place..." 
              value={search} 
              onChange={(event) => setSearch(event.target.value)} 
            />

            {/* Micro-locality Predictive Suggestions Popup UI */}
            {filteredLocalPlaces.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                {filteredLocalPlaces.map((place) => (
                  <button
                    key={`${place.pincode}-${place.name}`}
                    onClick={() => jumpToLocalPlace(place)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-white/5 last:border-0"
                  >
                    <MapPin className="h-4 w-4 text-cyan-600 shrink-0" />
                    <div className="text-xs">
                      <span className="font-black text-slate-900 dark:text-white block">
                        {place.pincode} — {place.name}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        District: {place.district}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map Layers & Counters */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            {Object.entries(MAP_STYLES).map(([key, style]) => (
              <button
                key={key}
                onClick={() => setMapStyle(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  mapStyle === key ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {style.icon}
                <span className="hidden sm:inline">{style.name}</span>
              </button>
            ))}
          </div>
          <div className="rounded-2xl bg-rose-500/10 px-4 py-2 text-xs md:text-sm font-black text-rose-600 dark:text-rose-400 border border-rose-500/20 whitespace-nowrap">
            {loading ? "Syncing..." : `${activeReports.length} Active Blocks`}
          </div>
        </div>
      </div>

      {error && <div className="mb-5 rounded-2xl bg-rose-50 p-4 font-bold text-rose-600 dark:bg-rose-500/10 dark:text-rose-200">{error}</div>}

      {/* Main Structural Map Area */}
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm relative h-[60vh] md:h-[75vh] min-h-[500px]">
          <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom className="h-full w-full z-0">
            <FlyToLocation center={mapCenter} zoom={mapZoom} />
            <TileLayer attribution={MAP_STYLES[mapStyle].attribution} url={MAP_STYLES[mapStyle].url} maxZoom={19} />
            
            {/* Dynamic Local Marker based on search selection anchor */}
            <Marker icon={blockIcon} position={mapCenter}>
              <Popup className="rounded-xl">
                <div className="font-bold text-slate-900 text-center text-xs p-1">
                  <MapIcon className="h-4 w-4 mx-auto text-rose-600 mb-1" />
                  <span className="block font-black text-sm">Inspecting Viewpoint</span>
                  Coordinates: {mapCenter[0].toFixed(4)}, {mapCenter[1].toFixed(4)}
                </div>
              </Popup>
            </Marker>

            {activeReports.map((report) => (
              <Polyline 
                className="report-line animate-pulse" 
                color={report.reason === "Flood" ? "#0ea5e9" : "#e11d48"} 
                key={`line-${report.id}`} 
                positions={[[report.from_lat, report.from_lng], [report.to_lat, report.to_lng]]} 
                weight={8} 
              />
            ))}
          </MapContainer>
        </div>

        {/* Sidebar Feed Panels */}
        <aside className="glass-panel max-h-[60vh] md:max-h-[75vh] flex flex-col overflow-hidden p-4 rounded-3xl border border-slate-200 bg-white/50 dark:bg-slate-900/50 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-white/10 pb-3 shrink-0">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-cyan-600" />
              Local Road Blocks
            </h2>
          </div>

          <div className="space-y-3 overflow-y-auto pr-1 flex-1 pb-4 custom-scrollbar">
            {activeReports.map((report) => (
              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-800/80" key={report.id}>
                <p className="font-black text-sm text-slate-900 dark:text-white leading-tight">
                  {report.road_name || `${report.from_label} → ${report.to_label}`}
                </p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {report.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="bg-slate-50 dark:bg-slate-700 text-[10px] font-bold px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                    📍 {report.district}
                  </span>
                  <span className="text-xs font-black text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                    {report.reason}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default TrafficMap;  