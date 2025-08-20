import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Project {
  title: string;
  description: string;
  image?: string;
}

const projects: Project[] = [
  {
    title: '프로젝트 1',
    description: '프로젝트 설명이 들어갑니다.'
  },
  {
    title: '프로젝트 2',
    description: '프로젝트 설명이 들어갑니다.'
  }
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="space-y-8">
      <h2 className="text-2xl font-semibold text-center">프로젝트</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">프로젝트 이미지</span>
            </div>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" size="sm">
                자세히 보기
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;