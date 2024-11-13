export default function ServicesGrid() {
  const services = [
    {
      title: "Topic Identification and Categorization",
      description: "Strategic content planning and topic organization to establish clear content hierarchies and categories."
    },
    {
      title: "Keyword Research for Each Page",
      description: "In-depth keyword analysis to identify the most valuable search terms and user intent for each content piece."
    },
    {
      title: "Create Content Outlines",
      description: "Develop comprehensive content structures and detailed outlines to guide content creation."
    },
    {
      title: "Generate Initial Content Drafts",
      description: "Create high-quality first drafts based on research, outlines, and content strategy guidelines."
    },
    {
      title: "Enrich Content with Authority",
      description: "Enhance content value with external links, multimedia, and authoritative sources."
    },
    {
      title: "Final Review and Publishing",
      description: "Quality assurance review, design integration, and strategic content distribution across channels."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-8">
        <h2 className="text-4xl font-bold text-center mb-16">Content Creation Workflow</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}