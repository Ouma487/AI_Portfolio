'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generateAboutMe } from '@/ai/flows/generate-about-me';
import { personalData, skills } from '@/lib/data';
import { Badge } from './ui/badge';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

const AboutSection = () => {
  const [userInput, setUserInput] = useState(personalData.bio);
  const [tone, setTone] = useState('Professional');
  const [generatedAboutMe, setGeneratedAboutMe] = useState(personalData.bio);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(async () => {
      const result = await generateAboutMe({ userInput, tone });
      setGeneratedAboutMe(result.aboutMeText);
    });
  };

  return (
    <section id="about" className="container mx-auto py-16 px-4 md:py-24 md:px-6">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            About Me
          </h2>
          <div className="flex items-center gap-4">
            <Image
              src="https://picsum.photos/seed/avatar/120/120"
              alt={personalData.name}
              width={120}
              height={120}
              className="rounded-full border-4 border-primary shadow-lg"
              data-ai-hint="professional portrait"
            />
            <div>
              <h3 className="text-2xl font-bold font-headline">{personalData.name}</h3>
              <p className="text-muted-foreground">{personalData.title}</p>
            </div>
          </div>
          <p className="text-lg text-foreground/80">{generatedAboutMe}</p>
          
          <div className="space-y-4">
            <h4 className="font-headline text-2xl font-bold">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill.name} variant="secondary" className="text-base py-1 px-3 flex items-center gap-2">
                    <skill.icon className="h-4 w-4 text-accent" />
                    {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Card className="bg-card/50">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-headline text-2xl font-bold">Customize My Bio</h3>
            <p className="text-muted-foreground">
              Don't like the current one? Use AI to generate a new "About Me" with a different tone.
            </p>
            <div className="space-y-2">
              <Label htmlFor="bio-input">Core Information</Label>
              <Textarea
                id="bio-input"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                rows={5}
                placeholder="Tell me a bit about yourself..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone-select">Select a Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone-select">
                  <SelectValue placeholder="Select a tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="Witty">Witty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerate} disabled={isPending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generate New Bio
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AboutSection;
