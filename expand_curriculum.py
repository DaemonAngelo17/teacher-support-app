import json
import re

# 1. Load the existing data.js file to retain the 540 Grade 1 & 2 topics
print("Loading current Grade 1 & 2 topics from data.js...")
existing_topics = []

try:
    with open("data.js", "r", encoding="utf-8") as f:
        content = f.read()
        # Extract the JSON array from 'const curriculumData = [...];'
        match = re.search(r'const curriculumData = (\[.*?\]);', content, re.DOTALL)
        if match:
            existing_topics = json.loads(match.group(1))
            print(f"Loaded {len(existing_topics)} existing topics from data.js.")
except Exception as e:
    print(f"Notice: Could not load existing data.js: {e}")

# Filter existing topics to make sure we keep all Grade 1 & 2 topics
g1_g2_topics = [t for t in existing_topics if t.get("grade") in [1, 2]]
if not g1_g2_topics:
    g1_g2_topics = existing_topics

print(f"Retaining {len(g1_g2_topics)} Grade 1 & Grade 2 topics...")

# 2. Curriculum expansion database for Grades 3 through 12
expansion_data = [
  # ==========================================
  # GRADE 3
  # ==========================================
  {"grade": 3, "subject": "science", "topic": "States of Matter & Phase Changes", "description": "Classify solids, liquids, and gases and understand melting, freezing, and evaporation."},
  {"grade": 3, "subject": "science", "topic": "Heat, Light, and Sound Energy", "description": "Explore heat sources, light propagation, and sound production through vibrations."},
  {"grade": 3, "subject": "science", "topic": "Plant & Animal Adaptations", "description": "Investigate how physical structures help living things survive in terrestrial and aquatic habitats."},
  {"grade": 3, "subject": "science", "topic": "Earth's Surface & Weathering", "description": "Identify landforms, water bodies, soil composition, and daily weather recording."},
  
  {"grade": 3, "subject": "math", "topic": "Multiplication Tables (1 to 10)", "description": "Master basic multiplication facts, equal groups, arrays, and properties of multiplication."},
  {"grade": 3, "subject": "math", "topic": "Division Concepts & Basic Facts", "description": "Understand division as equal sharing, repeated subtraction, and inverse of multiplication."},
  {"grade": 3, "subject": "math", "topic": "4-Digit Place Value & Rounding", "description": "Read, write, compare, and round numbers up to 10,000 in symbols and words."},
  {"grade": 3, "subject": "math", "topic": "Fractions: Proper, Improper & Equivalent", "description": "Identify numerators, denominators, unit fractions, and equivalent fraction models."},
  {"grade": 3, "subject": "math", "topic": "Perimeter & Area of Rectangles", "description": "Calculate boundary perimeters and grid areas using standard metric units."},

  {"grade": 3, "subject": "social", "topic": "Ang Lalawigan at Rehiyon", "description": "Suriin ang heograpiya, simbolo, kultura, at mga bayani ng sariling lalawigan at rehiyon."},
  {"grade": 3, "subject": "social", "topic": "Mga Likas na Yaman ng Rehiyon", "description": "Tukuyin ang mga pangunahing kabuhayan, produkto, at pangangalaga sa kalikasan ng rehiyon."},

  {"grade": 3, "subject": "english", "topic": "Sentence Structures & Types", "description": "Distinguish statements, questions, commands, and exclamations with correct punctuation."},
  {"grade": 3, "subject": "english", "topic": "Regular & Irregular Verbs in Tenses", "description": "Construct sentences using present, past, and future verb forms adhering to agreement."},
  {"grade": 3, "subject": "english", "topic": "Reading Comprehension & Cause and Effect", "description": "Identify main ideas, supporting details, character traits, and cause-effect relationships."},

  {"grade": 3, "subject": "filipino", "topic": "Bahagi ng Pananalita at Pabula", "description": "Matukoy ang pangngalan, panghalip, pandiwa, at pang-uri sa pag-unawa ng mga pabula at alamat."},
  {"grade": 3, "subject": "filipino", "topic": "Pagsulat ng Maikling Talata", "description": "Mabuo ang payak na talata na may tamang bantas, baybay, at gamit ng malaking titik."},

  # ==========================================
  # GRADE 4
  # ==========================================
  {"grade": 4, "subject": "science", "topic": "Human Digestive & Musculoskeletal Systems", "description": "Trace the path of food and explain how bones, joints, and muscles facilitate movement."},
  {"grade": 4, "subject": "science", "topic": "Life Cycles & Specialized Plant/Animal Structures", "description": "Compare complete vs. incomplete metamorphosis and aquatic vs. terrestrial plant survival."},
  {"grade": 4, "subject": "science", "topic": "Soil Types & Water Cycle Dynamics", "description": "Analyze soil permeability, erosion, and stages of evaporation, condensation, and precipitation."},
  {"grade": 4, "subject": "science", "topic": "Simple Machines & Force Interactions", "description": "Demonstrate levers, inclined planes, pulleys, wheels, and friction forces in daily work."},

  {"grade": 4, "subject": "math", "topic": "Multi-Digit Multiplication & Long Division", "description": "Multiply up to 3-digit numbers by 2-digit numbers and solve long division with remainders."},
  {"grade": 4, "subject": "math", "topic": "Factors, Multiples, GCF & LCM", "description": "Determine prime and composite numbers, Greatest Common Factor, and Least Common Multiple."},
  {"grade": 4, "subject": "math", "topic": "Operations on Fractions & Decimals Intro", "description": "Add/subtract similar fractions, convert fractions to tenths/hundredths decimals."},
  {"grade": 4, "subject": "math", "topic": "Angles, Triangles & Quadrilaterals", "description": "Measure acute, right, and obtuse angles, and classify parallelograms, trapezoids, and rhombuses."},
  {"grade": 4, "subject": "math", "topic": "Perimeter, Area & Volume of Composite Shapes", "description": "Compute areas of composite polygons and volumes of rectangular prisms in cubic units."},

  {"grade": 4, "subject": "social", "topic": "Heograpiya at Uri ng Teritoryo ng Pilipinas", "description": "Matukoy ang kinalalagyan, sukat, anyong lupa, anyong tubig, at klima ng kapuluan ng Pilipinas."},
  {"grade": 4, "subject": "social", "topic": "Likas na Yaman at Likas-Kayang Pag-unlad", "description": "Suriin ang yamang lupa, tubig, gubat, mineral, at mga programa para sa sustainable development."},

  {"grade": 4, "subject": "english", "topic": "Subject-Verb Agreement & Compound Sentences", "description": "Combine clauses using coordinating conjunctions and maintain agreement with singular/plural subjects."},
  {"grade": 4, "subject": "english", "topic": "Informational Text Structures & Outlining", "description": "Identify problem-solution, description, and procedural text structures and create topic outlines."},

  {"grade": 4, "subject": "filipino", "topic": "Pokus ng Pandiwa at Uri ng Pang-abay", "description": "Magamit ang pokus sa tagaganap at layon, pati na ang pang-abay na pamanahon at panlunan."},
  {"grade": 4, "subject": "filipino", "topic": "Pagsulat ng Liham Pangkaibigan at Pormal", "description": "Matutuhan ang mga bahagi ng liham at maipahayag ang opinyon sa mga isyung pampaaralan."},

  # ==========================================
  # GRADE 5
  # ==========================================
  {"grade": 5, "subject": "science", "topic": "Human Reproductive System & Puberty Changes", "description": "Identify male and female reproductive organs, menstrual cycle stages, and hygiene maintenance."},
  {"grade": 5, "subject": "science", "topic": "Plant Reproduction & Estuarine Ecosystems", "description": "Compare flowering (pollination) vs. non-flowering (spores/cones) plants and mangrove food webs."},
  {"grade": 5, "subject": "science", "topic": "Physical vs. Chemical Changes in Matter", "description": "Distinguish reversible physical changes from irreversible chemical reactions (rusting, burning)."},
  {"grade": 5, "subject": "science", "topic": "Electric Circuits & Electromagnets", "description": "Construct series and parallel circuits, conductors vs. insulators, and magnetic coils."},
  {"grade": 5, "subject": "science", "topic": "Weather Disturbances & Moon Phases", "description": "Analyze typhoon signals, storm surges, and the causes of lunar phases and tides."},

  {"grade": 5, "subject": "math", "topic": "Divisibility Rules & Prime Factorization", "description": "Apply divisibility rules for 2, 3, 4, 5, 6, 8, 9, 10, 11, 12 and draw factor trees."},
  {"grade": 5, "subject": "math", "topic": "Operations on Dissimilar Fractions & Mixed Numbers", "description": "Perform addition, subtraction, multiplication, and division of fractions using LCD."},
  {"grade": 5, "subject": "math", "topic": "Decimals: Four Fundamental Operations", "description": "Add, subtract, multiply, and divide decimals up to thousandths place value."},
  {"grade": 5, "subject": "math", "topic": "Ratio, Proportion, Percentage & Base", "description": "Solve direct proportions, percentage problems (Percentage = Rate x Base), and discounts."},
  {"grade": 5, "subject": "math", "topic": "Circumference, Area of Circles & 3D Volumes", "description": "Calculate circle circumference (C = πd) and area (A = πr²) and volumes of pyramids/cubes."},

  {"grade": 5, "subject": "social", "topic": "Sinaunang Lipunang Pilipino bago ang Kolonyalismo", "description": "Suriin ang sistemang barangay, kabuhayan, paniniwala, at kultura ng mga sinaunang Pilipino."},
  {"grade": 5, "subject": "social", "topic": "Kolonyalismong Espanyol at Kristiyanisasyon", "description": "Unawain ang reduccion, encomienda, tributo, polo y servicio, at mga maagang pag-aalsa."},

  {"grade": 5, "subject": "english", "topic": "Perfect Verb Tenses & Modals", "description": "Use present perfect, past perfect, and future perfect tenses, along with modals (can, must, should)."},
  {"grade": 5, "subject": "english", "topic": "Figures of Speech & Expository Paragraphs", "description": "Analyze similes, metaphors, personification, hyperbole, and write cause-and-effect essays."},

  {"grade": 5, "subject": "filipino", "topic": "Aspekto ng Pandiwa at Pang-ugnay", "description": "Magamit nang wasto ang mga pangatnig, pang-angkop, at pang-ukol sa pagbuo ng sanaysay."},
  {"grade": 5, "subject": "filipino", "topic": "Pag-unawa sa Panoorin at Balita", "description": "Suriin ang mga elemento ng balita, babasahin, at infographics upang makabuo ng reaksyon."},

  # ==========================================
  # GRADE 6
  # ==========================================
  {"grade": 6, "subject": "science", "topic": "Human Circulatory, Respiratory & Nervous Systems", "description": "Examine heart chambers, gas exchange in alveoli, and brain-spinal cord nerve signaling."},
  {"grade": 6, "subject": "science", "topic": "Vertebrates, Invertebrates & Coral Reef Ecosystems", "description": "Classify mammals, birds, reptiles, amphibians, fish, arthropods, mollusks, and rainforest food webs."},
  {"grade": 6, "subject": "science", "topic": "Mixtures, Solutions & Separating Techniques", "description": "Differentiate homogeneous solutions from heterogeneous suspensions; practice filtration and evaporation."},
  {"grade": 6, "subject": "science", "topic": "Energy Transformation & Simple Machines", "description": "Analyze chemical-to-electrical transformations, efficiency of compound machines, and work principles."},
  {"grade": 6, "subject": "science", "topic": "Earthquakes, Volcanic Eruptions & Planets", "description": "Understand seismic waves, fault lines, magma chambers, and planetary solar orbits."},

  {"grade": 6, "subject": "math", "topic": "Four Operations on Fractions & Mixed Numbers", "description": "Master complex fraction word problems, reciprocal multiplication, and simplifying ratios."},
  {"grade": 6, "subject": "math", "topic": "Integers & Operations on the Number Line", "description": "Add, subtract, multiply, and divide positive and negative integers using rules of signs."},
  {"grade": 6, "subject": "math", "topic": "Algebraic Expressions & Simple Equations", "description": "Translate verbal phrases into algebraic expressions and solve one-variable linear equations."},
  {"grade": 6, "subject": "math", "topic": "Surface Area & Volume of Prisms, Pyramids, Spheres", "description": "Calculate total surface area and volume of cylinders, cones, spheres, and rectangular prisms."},
  {"grade": 6, "subject": "math", "topic": "Pie Charts, Bar Graphs & Theoretical Probability", "description": "Interpret circle graphs, calculate mean/median/mode, and determine probability ratios."},

  {"grade": 6, "subject": "social", "topic": "Ang Himagsikang Pilipino noong 1896 at Kalayaan", "description": "Suriin ang KKK, Deklarasyon ng Kalayaan noong 1898, Digmaang Pilipino-Amerikano, at Komonwelt."},
  {"grade": 6, "subject": "social", "topic": "Pananakop ng Hapon at ang Ikatlong Republika", "description": "Talakayin ang Ikalawang Digmaang Pandaigdig, Hukbalahap, at ang hamon ng malayang republika."},

  {"grade": 6, "subject": "english", "topic": "Active vs. Passive Voice & Conditionals", "description": "Transform active sentences to passive voice and construct Zero, First, and Second Conditional sentences."},
  {"grade": 6, "subject": "english", "topic": "Evaluating Online Sources & Propaganda Devices", "description": "Identify bias, bandwagon, testimonial, transfer techniques, and verify source reliability."},

  {"grade": 6, "subject": "filipino", "topic": "Uri ng Pangungusap at Pag-edit ng Sulatin", "description": "Magamit ang payak, tambalan, at hugnayang pangungusap sa pagsulat ng maikling kuwento."},
  {"grade": 6, "subject": "filipino", "topic": "Panitikang Pilipino at Pagpapahalaga", "description": "Suriin ang mga katangian ng tula, dula, at balagtasan bilang bahagi ng pamana ng bansa."},

  # ==========================================
  # GRADE 7
  # ==========================================
  {"grade": 7, "subject": "science", "topic": "Scientific Method, Microscopy & Cell Biology", "description": "Formulate testable hypotheses, operate compound light microscopes, and compare plant vs. animal cells."},
  {"grade": 7, "subject": "science", "topic": "Levels of Organization & Reproduction Modes", "description": "Examine organ systems, tissues, organisms, population, and compare asexual (budding/binary fission) vs. sexual reproduction."},
  {"grade": 7, "subject": "science", "topic": "Elements, Compounds & Solutions Concentrations", "description": "Locate elements on the periodic table, identify chemical formulas, and calculate mass percent of solutions."},
  {"grade": 7, "subject": "science", "topic": "Motion: Speed, Velocity & Acceleration Graphs", "description": "Interpret distance-time and velocity-time graphs; calculate average speed (v = d/t) and acceleration."},
  {"grade": 7, "subject": "science", "topic": "Waves, Electromagnetic Spectrum & Earth's Atmosphere", "description": "Describe transverse/longitudinal waves, heat transfer (conduction, convection, radiation), and atmospheric layers."},

  {"grade": 7, "subject": "math", "topic": "Real Number System & Integer Operations", "description": "Classify rational and irrational numbers, evaluate absolute values, and compute set unions/intersections."},
  {"grade": 7, "subject": "math", "topic": "Algebraic Expressions & Polynomial Operations", "description": "Add, subtract, multiply, and divide polynomials; expand binomials using FOIL method."},
  {"grade": 7, "subject": "math", "topic": "Linear Equations & Inequalities in One Variable", "description": "Solve multi-step linear equations, graph solution sets on number lines, and model word problems."},
  {"grade": 7, "subject": "math", "topic": "Angles, Parallel Lines & Transversals", "description": "Determine alternate interior, alternate exterior, and corresponding angle measures."},
  {"grade": 7, "subject": "math", "topic": "Statistics: Frequency Distributions & Measures of Central Tendency", "description": "Calculate mean, median, mode for grouped and ungrouped data; construct histograms."},

  {"grade": 7, "subject": "social", "topic": "Araling Asyano: Heograpiya at Sinaunang Kabihasnan", "description": "Suriin ang mga rehiyon sa Asya, kabihasnang Mesopotamia, Indus, at Dilaw na Ilog (Huang Ho)."},
  {"grade": 7, "subject": "social", "topic": "Kultura, Relihiyon, at Nasyonalismo sa Asya", "description": "Unawain ang Hinduismo, Budismo, Islam, Kolonyalismo sa Asya, at ang paglaya ng mga bansang Asyano."},

  {"grade": 7, "subject": "english", "topic": "Philippine Literature in the Pre-Colonial & Spanish Eras", "description": "Analyze folktales, epics (Biag ni Lam-ang), proverbs, and early Philippine poetry."},
  {"grade": 7, "subject": "english", "topic": "Analogy, Direct/Reported Speech & Structural Analysis", "description": "Complete word analogies, convert direct speech to reported speech, and use prefixes/roots."},

  {"grade": 7, "subject": "filipino", "topic": "Panitikang Rehiyonal at Ibong Adarna", "description": "Suriin ang kuwentong-bayan, epiko, at ang nobelang Ibong Adarna (mga tauhan, pakikipagsapalaran, aral)."},
  {"grade": 7, "subject": "filipino", "topic": "Mga Elemento ng Tula at Maikling Kuwento", "description": "Tukuyin ang sukat, tugma, talinghaga, banghay, at pananaw sa mga akdang pampanitikan."},

  # ==========================================
  # GRADE 8
  # ==========================================
  {"grade": 8, "subject": "science", "topic": "Newton's Three Laws of Motion & Work-Energy", "description": "Apply F=ma, inertia, action-reaction, potential/kinetic energy formulas (PE=mgh, KE=1/2mv²)."},
  {"grade": 8, "subject": "science", "topic": "Sound Waves, Light Refraction & Heat Capacity", "description": "Calculate wave speed (v=fλ), dispersion of light through prisms, and thermal expansion."},
  {"grade": 8, "subject": "science", "topic": "Electricity: Current, Voltage & Resistance (Ohm's Law)", "description": "Apply Ohm's Law (V=IR), calculate electrical power (P=VI), and compare series/parallel loads."},
  {"grade": 8, "subject": "science", "topic": "Earthquakes, Fault Lines & Typhoon Dynamics", "description": "Trace epicenters along active faults, seismic P/S waves, and tropical cyclone formation in PAR."},
  {"grade": 8, "subject": "science", "topic": "Atomic Structure, Periodic Trends & Cell Division", "description": "Locate subatomic particles (protons, neutrons, electrons), electron configuration, mitosis vs. meiosis."},

  {"grade": 8, "subject": "math", "topic": "Special Products & Factoring Polynomials", "description": "Factor difference of squares, perfect square trinomials, sum/difference of cubes, and general trinomials."},
  {"grade": 8, "subject": "math", "topic": "Rational Algebraic Expressions & Operations", "description": "Simplify complex rational expressions; add, subtract, multiply, and divide rational terms."},
  {"grade": 8, "subject": "math", "topic": "Rectangular Coordinate System & Linear Functions", "description": "Determine slope (m), graph linear equations via intercepts and slope-intercept form (y=mx+b)."},
  {"grade": 8, "subject": "math", "topic": "Systems of Linear Equations & Inequalities", "description": "Solve 2x2 linear systems by substitution, elimination, and graphing; model real-world constraints."},
  {"grade": 8, "subject": "math", "topic": "Triangle Congruence Postulates & Proofs", "description": "Prove geometric theorems using SSS, SAS, ASA, and AAS congruence criteria."},

  {"grade": 8, "subject": "social", "topic": "Kasaysayan ng Daigdig: Sinaunang Tao hanggang Gitnang Panahon", "description": "Talakayin ang rebolusyong neolitiko, Greece, Roma, Pyudalismo, at ang Gitnang Panahon sa Europa."},
  {"grade": 8, "subject": "social", "topic": "Rebolusyong Siyentipiko, Industriyal, at Digmaang Pandaigdig", "description": "Suriin ang Enlightenment, Unang Digmaang Pandaigdig, Ikalawang Digmaang Pandaigdig, at Cold War."},

  {"grade": 8, "subject": "english", "topic": "Afro-Asian Literature & Cohesive Devices", "description": "Explore literature of India, China, Japan, Africa, and construct persuasive speeches using transitions."},
  {"grade": 8, "subject": "english", "topic": "Parallelism & Modals in Argumentative Texts", "description": "Maintain parallel grammatical structures and construct logical arguments supported by evidence."},

  {"grade": 8, "subject": "filipino", "topic": "Panitikang Pilipino sa Iba't Ibang Panahon at Florante at Laura", "description": "Suriin ang Karagatan, Duplo, Balagtasan, at ang koridong Florante at Laura ni Francisco Balagtas."},
  {"grade": 8, "subject": "filipino", "topic": "Pagsulat ng Sanaysay at Balagtasan", "description": "Bumuo ng sariling argumento at maipahayag ang kaisipan sa pamamagitan ng patulang pagtatalo."},

  # ==========================================
  # GRADE 9
  # ==========================================
  {"grade": 9, "subject": "science", "topic": "Circulatory & Respiratory Systems Dynamics", "description": "Analyze gas transport in blood, pulmonary vs. systemic circulation, and lifestyle diseases."},
  {"grade": 9, "subject": "science", "topic": "Non-Mendelian Genetics & DNA/RNA Intro", "description": "Solve incomplete dominance, codominance, multiple alleles (blood types), and sex-linked traits."},
  {"grade": 9, "subject": "science", "topic": "Photosynthesis & Cellular Respiration Pathways", "description": "Compare light-dependent reactions (chloroplast) and Krebs cycle/ATP production (mitochondria)."},
  {"grade": 9, "subject": "science", "topic": "Chemical Bonding & Organic Carbon Compounds", "description": "Write Lewis dot structures, ionic vs. covalent bonding, alkanes, alkenes, alkynes, and functional groups."},
  {"grade": 9, "subject": "science", "topic": "Projectile Motion, Momentum & Volcanoes", "description": "Solve horizontal/angled projectile trajectories, impulse-momentum theorem, and magma viscosity."},

  {"grade": 9, "subject": "math", "topic": "Quadratic Equations & Quadratic Formula", "description": "Solve ax²+bx+c=0 by factoring, completing the square, and using the quadratic formula."},
  {"grade": 9, "subject": "math", "topic": "Quadratic Functions & Parabola Graphs", "description": "Graph y=a(x-h)²+k, identify vertex, domain, range, axis of symmetry, and intercepts."},
  {"grade": 9, "subject": "math", "topic": "Variations: Direct, Inverse, Joint & Combined", "description": "Model direct (y=kx), inverse (y=k/x), and joint variations to solve real-world problems."},
  {"grade": 9, "subject": "math", "topic": "Radical Expressions & Equations", "description": "Simplify radicals, rationalize denominators, perform operations, and solve radical equations."},
  {"grade": 9, "subject": "math", "topic": "Right Triangle Trigonometry & SohCahToa", "description": "Calculate sine, cosine, tangent, secant, cosecant, cotangent ratios, and angles of elevation/depression."},

  {"grade": 9, "subject": "social", "topic": "Ekonomiks: Kakapusan, Alokasyon, at Demand/Supply", "description": "Suriin ang scarcity, opportunity cost, batas ng demand at supply, price elasticity, at pamilihan."},
  {"grade": 9, "subject": "social", "topic": "Pambansang Ekonomiya at Sektor ng Ekonomiya", "description": "Unawain ang Gross Domestic Product (GDP), implasyon, patakarang piskal, pananalapi, at agrikultura."},

  {"grade": 9, "subject": "english", "topic": "Anglo-American Literature: Shakespearean Drama & Poetry", "description": "Analyze Romeo and Juliet, sonnets, dramatic poetry, and literary devices."},
  {"grade": 9, "subject": "english", "topic": "Argumentative Essay Writing & Fallacies", "description": "Formulate strong thesis statements, evaluate evidence, and detect logical fallacies."},

  {"grade": 9, "subject": "filipino", "topic": "Panitikang Asyano at Noli Me Tangere", "description": "Suriin ang mga maikling kuwento sa Asya at ang nobelang Noli Me Tangere ni Dr. Jose Rizal."},
  {"grade": 9, "subject": "filipino", "topic": "Pagsusuri ng Akda at Nobela", "description": "Talakayin ang kanser ng lipunan, mga simbolo, at tauhan sa nobelang Noli Me Tangere."},

  # ==========================================
  # GRADE 10
  # ==========================================
  {"grade": 10, "subject": "science", "topic": "Plate Tectonics & Continental Drift Evidence", "description": "Examine seafloor spreading, magnetic reversal, convergent/divergent boundaries, and subduction zones."},
  {"grade": 10, "subject": "science", "topic": "Electromagnetic Spectrum & Optics (Mirrors & Lenses)", "description": "Calculate wave frequencies; ray trace concave/convex mirrors and converging/diverging lenses."},
  {"grade": 10, "subject": "science", "topic": "Electric Motors, Generators & Endocrine Regulation", "description": "Demonstrate Faraday's law of induction, electromagnetic generators, and feedback hormone loops."},
  {"grade": 10, "subject": "science", "topic": "DNA Replication, Protein Synthesis & Mutations", "description": "Trace transcription (mRNA) and translation (tRNA/ribosome), and explain genetic mutations."},
  {"grade": 10, "subject": "science", "topic": "Gas Laws & Macromolecules of Life", "description": "Solve Boyle's, Charles's, and Ideal Gas Law problems (PV=nRT); analyze carbohydrates, lipids, proteins, nucleic acids."},

  {"grade": 10, "subject": "math", "topic": "Polynomial Functions & Synthetic Division", "description": "Apply Remainder and Factor Theorems, graph polynomial functions using end behavior and intercepts."},
  {"grade": 10, "subject": "math", "topic": "Circles: Chords, Tangents, Secants & Arc Measures", "description": "Prove circle theorems involving central/inscribed angles, tangent-secant power theorems, and arc lengths."},
  {"grade": 10, "subject": "math", "topic": "Coordinate Geometry: Distance & Midpoint Formulas", "description": "Derive the equation of a circle (x-h)²+(y-k)²=r² and solve geometric proofs on the Cartesian plane."},
  {"grade": 10, "subject": "math", "topic": "Arithmetic & Geometric Sequences and Series", "description": "Determine nth terms, common differences/ratios, sum of finite arithmetic/geometric series, and infinite series."},
  {"grade": 10, "subject": "math", "topic": "Permutations, Combinations & Compound Probability", "description": "Compute nPr and nCr, evaluate mutually exclusive and independent probability events."},

  {"grade": 10, "subject": "social", "topic": "Mga Kontemporaryong Isyu: Kapaligiran at Rebolusyong Ekonomiko", "description": "Suriin ang climate change, disaster risk management, globalisasyon, at mga isyu sa paggawa."},
  {"grade": 10, "subject": "social", "topic": "Karapatang Pantao, Kasarian, at Karapatang Sibil", "description": "Talakayin ang Universal Declaration of Human Rights, Gender and Development (GAD), at epektibong pamamahala."},

  {"grade": 10, "subject": "english", "topic": "World Literature & Masterpieces", "description": "Explore Greek/Roman mythology, epic poetry, and universal human themes across cultures."},
  {"grade": 10, "subject": "english", "topic": "Research Report Writing & Citations (APA/MLA)", "description": "Conduct research, write formal literature reviews, paraphrase accurately, and format reference lists."},

  {"grade": 10, "subject": "filipino", "topic": "Panitikang Pandaigdig at El Filibusterismo", "description": "Suriin ang mga mitolohiya ng daigdig at ang nobelang El Filibusterismo ni Dr. Jose Rizal."},
  {"grade": 10, "subject": "filipino", "topic": "Pagsulat ng Pananaliksik at Pagsusuri", "description": "Bumuo ng kritikal na pagsusuri sa nobelang El Filibusterismo at kaugnayan nito sa kasalukuyan."},

  # ==========================================
  # GRADE 11 (SENIOR HIGH SCHOOL CORE & STEM)
  # ==========================================
  {"grade": 11, "subject": "science", "topic": "General Biology 1: Cell Structure & Bioenergetics", "description": "Examine organelle ultrastructure, membrane transport (diffusion/osmosis/active), ATP synthesis, and cellular respiration."},
  {"grade": 11, "subject": "science", "topic": "Earth & Life Science: Geologic Processes & Evolution", "description": "Analyze mineral properties, rock cycle, radiometric dating, plate tectonics, origin of life, and natural selection."},
  {"grade": 11, "subject": "science", "topic": "Physical Science: Stellar Nucleosynthesis & Stoichiometry", "description": "Trace formation of heavy elements in stars, intermolecular forces, chemical reaction rates, and stoichiometry."},

  {"grade": 11, "subject": "math", "topic": "General Mathematics: Functions & Business Math", "description": "Evaluate composite/inverse functions, exponential/logarithmic functions, simple/compound interest, and annuities."},
  {"grade": 11, "subject": "math", "topic": "Pre-Calculus: Conic Sections & Trigonometric Identities", "description": "Analyze equations and graphs of Circles, Parabolas, Ellipses, Hyperbolas, and prove fundamental trig identities."},

  {"grade": 11, "subject": "social", "topic": "Understanding Culture, Society, and Politics (UCSP)", "description": "Analyze cultural evolution, ethnocentrism, social stratification, political institutions, and social change."},

  {"grade": 11, "subject": "english", "topic": "Oral Communication in Context", "description": "Examine models of communication, speech acts, intercultural communication, and deliver persuasive speeches."},
  {"grade": 11, "subject": "english", "topic": "Reading & Writing Skills for Academic Purposes", "description": "Master patterns of paragraph development, critical reading strategies, text organization, and professional letters."},

  {"grade": 11, "subject": "filipino", "topic": "Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino", "description": "Suriin ang kasaysayan ng Wikang Pambansa, barayti ng wika, at mga sitwasyong pangwika sa lipunan."},

  # ==========================================
  # GRADE 12 (SENIOR HIGH SCHOOL CORE & STEM)
  # ==========================================
  {"grade": 12, "subject": "science", "topic": "General Biology 2: Recombinant DNA & Systematics", "description": "Explore genetic engineering, PCR, DNA sequencing, phylogenetic trees, cladistics, and plant/animal organ systems."},
  {"grade": 12, "subject": "science", "topic": "General Chemistry 1 & 2: Thermodynamics & Electrochemistry", "description": "Calculate enthalpy/entropy changes, chemical equilibrium constants (Kc/Kp), Nernst equation, and reaction kinetics."},
  {"grade": 12, "subject": "science", "topic": "General Physics 1 & 2: Quantum Physics & Electromagnetism", "description": "Solve rotational kinematics, fluid dynamics, Coulomb's Law, Gauss's Law, circuits, and quantum photon energy."},

  {"grade": 12, "subject": "math", "topic": "Basic Calculus: Limits, Derivatives & Integrals", "description": "Calculate function limits, derivatives (power/product/quotient rules), optimization, antiderivatives, and areas under curves."},
  {"grade": 12, "subject": "math", "topic": "Statistics & Probability: Normal Distribution & Hypothesis Testing", "description": "Evaluate z-scores, sampling distributions, confidence intervals, t-tests, and hypothesis testing for population means."},

  {"grade": 12, "subject": "social", "topic": "Philippine Politics and Governance", "description": "Examine executive, legislative, and judicial branches, local government units (LGUs), elections, and civil society."},

  {"grade": 12, "subject": "english", "topic": "21st Century Literature from the Philippines and World", "description": "Analyze contemporary genres (graphic novels, flash fiction, hyperpoetry) and canonical world authors."},
  {"grade": 12, "subject": "english", "topic": "English for Academic & Professional Purposes (EAPP)", "description": "Draft concept papers, position papers, executive summaries, survey reports, and research project proposals."},

  {"grade": 12, "subject": "filipino", "topic": "Pagbasa at Pagsusuri ng Iba't Ibang Teksto sa Pananaliksik", "description": "Bumuo ng pamagat ng pananaliksik, konseptong papel, at magsagawa ng pagsusuri ng datos sa Filipino."},
  {"grade": 12, "subject": "filipino", "topic": "Pagsulat sa Filipino sa Piling Larang (Akademik)", "description": "Matutuhan ang pagsulat ng Abstrak, Sintesis, Bionote, Katitikan ng Pulong, at Lakbay-Sanaysay."}
]

# Generate standardized objects for expansion topics
expanded_topics = []
for item in expansion_data:
    grade = item["grade"]
    subject = item["subject"]
    topic_name = item["topic"]
    description = item["description"]
    
    clean_topic = re.sub(r'[^a-zA-Z0-9]', '', topic_name).lower()[:15]
    topic_id = f"{subject}-g{grade}-{clean_topic}-{len(g1_g2_topics) + len(expanded_topics)}"
    
    concepts = [
        f"Master the core learning objectives of {topic_name}.",
        f"Analyze real-world applications and key concepts in {subject.capitalize()}.",
        "Develop critical thinking and problem-solving skills for classroom review."
    ]
    
    review_items = [
        {
            "question": f"What is the main topic covered in Grade {grade} {subject.capitalize()}: '{topic_name}'?",
            "answer": description
        },
        {
            "question": f"True or False: Understanding '{topic_name}' is essential for Grade {grade} academic competency.",
            "answer": "True. It is a core learning standard."
        },
        {
            "question": "How can teachers best explain this topic in the classroom?",
            "answer": f"By presenting clear definitions, interactive visual aids, and reviewing the core concepts with students."
        }
    ]
    
    expanded_topics.append({
        "id": topic_id,
        "subject": subject,
        "grade": grade,
        "topic": topic_name,
        "description": description,
        "coreConcepts": concepts,
        "resources": [
            {
                "type": "video",
                "label": f"{topic_name} - Video Tutorial",
                "url": f"https://www.youtube.com/results?search_query={topic_name.replace(' ', '+')}"
            },
            {
                "type": "worksheet",
                "label": f"Grade {grade} {topic_name} Worksheet",
                "url": f"https://www.google.com/search?q=Grade+{grade}+{topic_name.replace(' ', '+')}+worksheet+pdf"
            }
        ],
        "reviewItems": review_items
    })

# Combine existing Grade 1 & 2 topics with Grades 3-12 expansion topics
all_topics = g1_g2_topics + expanded_topics

print(f"Total topics compiled across Grades 1 through 12: {len(all_topics)}")

# Write updated database to data.js
js_content = "const curriculumData = " + json.dumps(all_topics, indent=2) + ";\n\n"
js_content += """// Export data for ESM or attach to window for simple browser scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = curriculumData;
} else {
  window.curriculumData = curriculumData;
}
"""

with open("data.js", "w", encoding="utf-8") as f_out:
    f_out.write(js_content)

print("Saved updated dataset to data.js!")
