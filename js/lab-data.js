/* =====================================================================================
   ICL profile data, used by person.html (each team member's profile page).

   Everything else on a profile is read from index.html automatically:
     - name, role, photo and social links  -> the person's card in "Our Team" / "Alumni"
     - papers                              -> the Publications list (matched by author name)
     - videos                              -> the Videos section (matched by the "By ..." line)
     - recent news                         -> the Recent News list (matched by name)
   So adding a paper, a video or a news line on index.html updates every profile by itself.

   This file adds what index.html does not have:
     people   -> optional bio and extra spellings of a name, keyed by the person's id
                 (the id is the photo file name without .jpg, e.g. img/team/azizul-haque.jpg -> "azizul-haque")
     projects -> research projects; members are everyone who authored one of the project's papers
     talks    -> talks and poster presentations, with who presented them
   ===================================================================================== */
window.ICL_DATA = {

	people: {
		'jonggi-hong': {
			aliases: ['Jonggi Hong', 'Dr. Hong'],
			bio: 'Jonggi Hong is an Assistant Professor in the Department of Computer Science at Stevens Institute of Technology, where he directs the Interactive Computing Lab. His research lies at the intersection of human-computer interaction, machine learning, and accessibility. Before joining Stevens, he was a postdoctoral researcher at the Smith-Kettlewell Eye Research Institute with Dr. James Coughlan. He received his Ph.D. in Computer Science from the University of Maryland, College Park in 2021, and his bachelor’s and master’s degrees in Computer Science from KAIST.'
		},
		'azizul-haque': {
			aliases: ['Azizul Hoque'],
			bio: 'I’m an M.Eng. candidate in Applied Artificial Intelligence at Stevens Institute of Technology and a Research Assistant in the Interactive Computing Lab. My research asks how AI can give blind and low-vision people access to information that is usually only visual, and I take that question from study design all the way to a system people can use. My main project, ASPIRE, sits quietly in a live talk: it detects each slide change, speaks a short description at a natural pause, and catches the listener back up to live by trimming long silences and filler words. My work on delay-buffered editing received a Best Paper Honorable Mention at ACM DIS 2026, and ASPIRE was presented at ACM ASSETS 2026.'
		},
		'nicholas-russo': { aliases: ['Nicholas Michael Russo'] }
	},

	/* papers: the ids of the publications (the id="pub-..." on each row in index.html, without "pub-").
	   image: a card image in img/projects/ (640 x 400 px). link: where the card goes (usually the main paper). */
	projects: [
		{ id: 'om-knowledge-graph', title: 'Knowledge Graph for Orientation & Mobility Instruction', years: '2026 – Present', image: 'img/projects/om-knowledge-graph.jpg',
		  summary: 'A knowledge graph of how orientation and mobility specialists guide blind and low-vision travelers, with the University of Minnesota.',
		  papers: ['aranas2026guidance'], link: 'https://doi.org/10.1145/3849741.3856142' },
		{ id: 'aspire', title: 'ASPIRE: Accessible Slide Presentations', years: '2025 – Present', image: 'img/projects/aspire.jpg',
		  summary: 'Real-time editing that makes live slide presentations accessible to blind and low-vision audiences.',
		  papers: ['haque2026aspire', 'haque2026delay', 'haque2025slides'], link: 'https://doi.org/10.1145/3800645.3812965' },
		{ id: 'iffa', title: 'Smart-Glasses Form-Filling Assistant', years: '2025 – Present', image: 'img/projects/iffa.jpg',
		  summary: 'A smart-glasses assistant that guides blind users through reading and filling out paper forms.',
		  papers: ['khan2026debugging', 'khan2025formfilling'], link: 'https://doi.org/10.1145/3663547.3759722' },
		{ id: 'conversational-ai', title: 'Trust and Emotion in Conversational AI', years: '2025 – Present', image: 'img/projects/conversational-ai.jpg',
		  summary: 'How people check chatbot answers, and what kind of emotional support they want from AI.',
		  papers: ['huang2026emotional', 'huang2025validation'], link: 'https://doi.org/10.54941/ahfe1006707' },
		{ id: 'catalablocks', title: 'CatalaBlocks', years: '2025 – 2026', image: 'img/projects/catalablocks.jpg',
		  summary: 'A block-based visual tool that helps legal professionals turn laws into code.',
		  papers: ['russo2026catalablocks'], link: 'https://doi.org/10.1145/3800645.3813091' },
		{ id: 'customsight', title: 'CustomSight', years: '2025', image: 'img/projects/customsight.jpg',
		  summary: 'LLM-powered visual assistance with goal-directed dynamic filters, with the University of Virginia.',
		  papers: ['rahman2025customsight'], link: 'https://doi.org/10.1145/3746058.3758401' },
		{ id: 'typing-haptically', title: 'Typing Haptically', years: '2025', image: 'img/projects/typing-haptically.jpg',
		  summary: 'Non-auditory smartphone text entry with haptic feedback, with KAIST.',
		  papers: ['yim2025haptic'], link: 'https://doi.org/10.1145/3746059.3747801' },
		{ id: 'vr-training', title: 'VR Training for Blind Navigation', years: '2023 – 2024', image: 'img/projects/vr-training.jpg',
		  summary: 'Virtual-reality practice that helps blind users aim a phone camera for navigation apps.',
		  papers: ['hong2024walklight', 'hong2023vr'], link: 'https://doi.org/10.1145/3677846.3677849' },
		{ id: 'teachable', title: 'Teachable Object Recognizers', years: '2019 – 2024', image: 'img/projects/teachable.jpg',
		  summary: 'Letting blind users personalize object recognizers with their own photos, and recover when recognition fails.',
		  papers: ['hong2024errors', 'hong2022teachable', 'lee2022lab', 'hong2020crowd', 'hong2019crowd', 'lee2019photography'], link: 'https://doi.org/10.1145/3517428.3544824' },
		{ id: 'dementia', title: 'Content Authored by People with Dementia', years: '2021', image: 'img/projects/dementia.jpg',
		  summary: 'How diaries written by people with dementia shape attitudes towards dementia.',
		  papers: ['lazar2021dementia'], link: 'https://doi.org/10.1145/3479542' },
		{ id: 'speech-input', title: 'Non-Visual Speech Input', years: '2018 – 2020', image: 'img/projects/speech-input.jpg',
		  summary: 'Finding and fixing speech recognition errors through audio alone.',
		  papers: ['hong2020speech', 'hong2018speech'], link: 'https://doi.org/10.1145/3382039' },
		{ id: 'wrist-haptics', title: 'Wrist-Based Haptic Guidance', years: '2016 – 2017', image: 'img/projects/wrist-haptics.jpg',
		  summary: 'Haptic wristbands that guide hand movement without vision.',
		  papers: ['hong2017haptic', 'hong2016angular'], link: 'https://doi.org/10.1145/3132525.3132538' },
		{ id: 'aphasia-hmd', title: 'Head-Worn Displays for Aphasia', years: '2016', image: 'img/projects/aphasia-hmd.jpg',
		  summary: 'Comparing a head-worn display with a smartphone for supporting conversation.',
		  papers: ['williams2016heads'], link: 'https://doi.org/10.1145/2982142.2982165' },
		{ id: 'smartwatch-typing', title: 'Smartwatch Text Entry', years: '2015 – 2016', image: 'img/projects/smartwatch-typing.jpg',
		  summary: 'Soft keyboards for wristwatch-sized touchscreens.',
		  papers: ['hong2016keyboards', 'hong2015splitboard'], link: 'https://doi.org/10.1145/2702123.2702273' },
		{ id: 'touchroller', title: 'TouchRoller', years: '2015', image: 'img/projects/touchroller.jpg',
		  summary: 'A touch-sensitive cylindrical input device for interactive TVs.',
		  papers: ['hong2015touchroller'], link: 'https://doi.org/10.1093/iwc/iwv006' },
		{ id: 'smart-wristband', title: 'Smart Wristband', years: '2014', image: 'img/projects/smart-wristband.jpg',
		  summary: 'A touch-and-motion tracking wristband for controlling smart glasses.',
		  papers: ['ham2014wristband'], link: 'https://doi.org/10.1007/978-3-319-07788-8_11' },
		{ id: 'touchshield', title: 'TouchShield', years: '2013', image: 'img/projects/touchshield.jpg',
		  summary: 'A virtual control for holding a smartphone steady with the thumb.',
		  papers: ['hong2013touchshield'], link: 'https://doi.org/10.1145/2468356.2468589' }
	],

	/* Newest first. people: ids of who presented. image: any picture (a gallery thumbnail works well).
	   type: 'Talk' or 'Poster'. Every link is optional. */
	talks: [
		{ title: 'ASPIRE: Accessible Slide Presentation via Intelligent Real-time Editing', type: 'Poster',
		  date: 'Oct 2026', event: 'ASSETS 2026', location: 'Porto, Portugal', people: ['azizul-haque'],
		  image: 'img/gallery/assets2026/01-thumb.jpg',
		  links: { paper: 'https://doi.org/10.1145/3797867.3841220', photos: 'gallery/assets2026/' } },
		{ title: 'Debugging Computer Vision as a Blind Researcher', type: 'Talk',
		  date: 'Oct 2026', event: 'ASSETS 2026', location: 'Porto, Portugal', people: ['rifat-rahman-khan'],
		  image: 'img/projects/iffa.jpg',
		  links: { paper: 'https://doi.org/10.1145/3797867.3832769' } },
		{ title: 'Enhancing Slide Presentation Accessibility for Blind and Low-Vision Audiences Through Delay-Buffered Editing', type: 'Talk',
		  date: 'Jun 2026', event: 'DIS 2026', location: 'Singapore', people: ['azizul-haque'],
		  image: 'img/gallery/dis2026/01-thumb.jpg',
		  links: { paper: 'https://doi.org/10.1145/3800645.3812965', video: 'https://www.youtube.com/watch?v=SXUrY8i6TEc', photos: 'gallery/dis2026/' } },
		{ title: 'CatalaBlocks: A Block-Based Visual Tool for Programming the Law', type: 'Talk',
		  date: 'Jun 2026', event: 'DIS 2026', location: 'Singapore', people: ['nicholas-russo'],
		  image: 'img/gallery/dis2026/03-thumb.jpg',
		  links: { paper: 'https://doi.org/10.1145/3800645.3813091', photos: 'gallery/dis2026/' } },
		{ title: 'Accessible Slide Presentation via Intelligent Real-time Editing: Insights from a Wizard-of-Oz Study', type: 'Poster',
		  date: 'Oct 2025', event: 'ASSETS 2025', location: 'Denver, CO', people: ['azizul-haque'],
		  image: 'img/gallery/assets2025/01-thumb.jpg',
		  links: { paper: 'https://doi.org/10.1145/3663547.3759719', photos: 'gallery/assets2025/' } },
		{ title: 'Exploring User Behavior and Validation Proficiency in Assessing Responses from a Conversational Agent', type: 'Talk',
		  date: 'Aug 2025', event: 'IHIET 2025', location: '', people: ['jiayin-huang'],
		  image: 'img/projects/conversational-ai.jpg',
		  links: { paper: 'https://doi.org/10.54941/ahfe1006707' } },
		{ title: 'Understanding How Blind Users Handle Object Recognition Errors: Strategies and Challenges', type: 'Talk',
		  date: 'Oct 2024', event: 'ASSETS 2024', location: 'St. John’s, Canada', people: ['jonggi-hong'],
		  image: 'img/projects/teachable.jpg',
		  links: { paper: 'https://doi.org/10.1145/3663548.3675635' } }
	]
};
