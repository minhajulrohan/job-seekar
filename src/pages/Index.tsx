import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Clock, DollarSign, Filter, Star, ExternalLink, Heart, Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
// import { UserMenu } from '@/components/UserMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
// import { AuthModal } from '@/components/AuthModal';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
type ExperienceLevel = 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Executive';
type SalaryRange = 'Under $50k' | '$50k-$75k' | '$75k-$100k' | 'Over $100k';

interface JobListing {
  id: number;
  title: string;
  company: string;
  location: string;
  country: string;
  salary: string;
  type: JobType;
  schedule: string;
  rating: number;
  description: string;
  requirements: string[];
  posted: string;
  applyLink: string;
  experienceLevel: ExperienceLevel;
  isRemote: boolean;
  salaryRange: SalaryRange;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedJobType, setSelectedJobType] = useState<JobType | ''>('');
  const [selectedExperience, setSelectedExperience] = useState<ExperienceLevel | ''>('');
  const [selectedSalary, setSelectedSalary] = useState<SalaryRange | ''>('');
  const [showRemoteOnly, setShowRemoteOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'salary'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>(() => {
    const savedFavorites = localStorage.getItem('jobFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  const { user } = useAuth();
  const jobsPerPage = 10;

  // Check if user is visiting for the first time
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (!hasVisited) {
      setShowWelcomePopup(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  // Generate 100 job listings
  const generateJobListings = (): JobListing[] => {
    const baseJobs: Omit<JobListing, 'id'>[] = [
      {
        title: "Amazon Delivery Station Warehouse Associate",
        company: "Amazon Warehouse",
        location: "Hattiesburg, MS 39401",
        country: "United States",
        salary: "$18.50 an hour",
        type: "Part-time",
        schedule: "Flextime",
        rating: 3.4,
        description: "Join our fast-paced warehouse team and help deliver packages to customers across the region.",
        requirements: ["Must be 18+ years old", "Ability to lift 50lbs", "Reliable transportation"],
        posted: "2 days ago",
        applyLink: "https://www.amazon.jobs/en/jobs/warehouse",
        experienceLevel: "Entry Level",
        isRemote: false,
        salaryRange: "Under $50k"
      },
      {
        title: "Senior Software Engineer",
        company: "Google",
        location: "Remote",
        country: "United States",
        salary: "$120,000 - $180,000",
        type: "Full-time",
        schedule: "Standard hours",
        rating: 4.6,
        description: "Lead engineering initiatives and mentor junior developers in our cloud platform team.",
        requirements: ["5+ years experience", "Strong system design skills", "Leadership experience"],
        posted: "1 day ago",
        applyLink: "https://careers.google.com/jobs/",
        experienceLevel: "Senior Level",
        isRemote: true,
        salaryRange: "Over $100k"
      },
      {
        title: "Marketing Coordinator",
        company: "Microsoft",
        location: "London, UK",
        country: "United Kingdom",
        salary: "£35,000 - £45,000",
        type: "Full-time",
        schedule: "Standard hours",
        rating: 4.3,
        description: "Support marketing campaigns and help drive brand awareness in the European market.",
        requirements: ["Marketing degree", "2+ years experience", "Excellent communication"],
        posted: "5 days ago",
        applyLink: "https://careers.microsoft.com/us/en",
        experienceLevel: "Mid Level",
        isRemote: false,
        salaryRange: "$50k-$75k"
      },
      {
        title: "Data Science Intern",
        company: "Meta",
        location: "Menlo Park, CA",
        country: "United States",
        salary: "$8,000 per month",
        type: "Internship",
        schedule: "Summer program",
        rating: 4.5,
        description: "Work on machine learning projects and analyze user behavior data.",
        requirements: ["Currently pursuing degree", "Python experience", "Statistical knowledge"],
        posted: "1 week ago",
        applyLink: "https://www.metacareers.com/",
        experienceLevel: "Entry Level",
        isRemote: false,
        salaryRange: "Over $100k"
      },
      {
        title: "Freelance UX Designer",
        company: "Design Studio Inc",
        location: "Remote",
        country: "Canada",
        salary: "$75 - $100 per hour",
        type: "Contract",
        schedule: "Flexible",
        rating: 4.2,
        description: "Design user interfaces for mobile applications and web platforms.",
        requirements: ["3+ years UX experience", "Portfolio required", "Figma proficiency"],
        posted: "3 days ago",
        applyLink: "https://example.com/apply",
        experienceLevel: "Mid Level",
        isRemote: true,
        salaryRange: "$75k-$100k"
      }
    ];

    // Generate 100 jobs by repeating and modifying base jobs
    const jobs: JobListing[] = [];
    for (let i = 0; i < 100; i++) {
      const baseJob = baseJobs[i % baseJobs.length];
      jobs.push({
        ...baseJob,
        id: i + 1,
        title: `${baseJob.title} ${Math.floor(i / baseJobs.length) + 1}`,
        posted: `${Math.floor(Math.random() * 14) + 1} days ago`
      });
    }
    return jobs;
  };

  const jobListings = generateJobListings();

  const filteredJobs = jobListings.filter(job => {
    const matchesTitle = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = location === '' || 
      job.location.toLowerCase().includes(location.toLowerCase()) ||
      job.country.toLowerCase().includes(location.toLowerCase());
    const matchesJobType = selectedJobType === '' || job.type === selectedJobType;
    const matchesExperience = selectedExperience === '' || job.experienceLevel === selectedExperience;
    const matchesSalary = selectedSalary === '' || job.salaryRange === selectedSalary;
    const matchesRemote = !showRemoteOnly || job.isRemote;
    
    return matchesTitle && matchesLocation && matchesJobType && matchesExperience && matchesSalary && matchesRemote;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.posted).getTime() - new Date(a.posted).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.posted).getTime() - new Date(b.posted).getTime();
    }
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (jobId: number) => {
    const newFavorites = favorites.includes(jobId)
      ? favorites.filter(id => id !== jobId)
      : [...favorites, jobId];
    
    setFavorites(newFavorites);
    localStorage.setItem('jobFavorites', JSON.stringify(newFavorites));
  };

  const handleSearch = () => {
    console.log('Searching for:', { searchQuery, location });
  };

  const clearFilters = () => {
    setSelectedJobType('');
    setSelectedExperience('');
    setSelectedSalary('');
    setShowRemoteOnly(false);
    setSortBy('newest');
  };

  const showModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">JobSeeker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {/* {user ? (
                <UserMenu />
              ) : (
                <>
                  <Button variant="ghost" onClick={() => showModal('login')}>
                    Sign In
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    onClick={() => showModal('signup')}
                  >
                    Sign Up
                  </Button>
                </>
              )} */}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Find Your Next
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent"> Dream Job</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover thousands of job opportunities from top companies. Start your career journey today.
          </p>

          {/* Search Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="City, state, zip code, or country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold"
              >
                <Search className="h-5 w-5 mr-2" />
                Search Jobs
              </Button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Button 
              variant={sortBy === 'newest' ? 'default' : 'outline'} 
              size="sm" 
              className="hover:bg-blue-50 dark:hover:bg-gray-700"
              onClick={() => setSortBy('newest')}
            >
              <Filter className="h-4 w-4 mr-2" />
              Newest First
            </Button>
            
            <select 
              value={selectedSalary} 
              onChange={(e) => setSelectedSalary(e.target.value as SalaryRange | '')}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Salaries</option>
              <option value="Under $50k">Under $50k</option>
              <option value="$50k-$75k">$50k-$75k</option>
              <option value="$75k-$100k">$75k-$100k</option>
              <option value="Over $100k">Over $100k</option>
            </select>

            <select 
              value={selectedJobType} 
              onChange={(e) => setSelectedJobType(e.target.value as JobType | '')}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>

            <select 
              value={selectedExperience} 
              onChange={(e) => setSelectedExperience(e.target.value as ExperienceLevel | '')}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Experience Levels</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Executive">Executive</option>
            </select>

            <Button 
              variant={showRemoteOnly ? 'default' : 'outline'} 
              size="sm" 
              className="hover:bg-blue-50 dark:hover:bg-gray-700"
              onClick={() => setShowRemoteOnly(!showRemoteOnly)}
            >
              Remote Only
            </Button>

            {(selectedJobType || selectedExperience || selectedSalary || showRemoteOnly) && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredJobs.length} Jobs Found
            </h3>
            <div className="flex items-center gap-4">
              <p className="text-gray-600 dark:text-gray-300">
                {location ? `Jobs in "${location}"` : 'All locations'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {paginatedJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-[1.02] bg-white dark:bg-gray-800">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                        {job.title}
                      </h4>
                      <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                        <Briefcase className="h-4 w-4 mr-2" />
                        <span className="font-medium">{job.company}</span>
                        <div className="flex items-center ml-3">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm">{job.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{job.location}</span>
                        {job.isRemote && (
                          <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Remote</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(job.id)}
                        className={`p-2 ${favorites.includes(job.id) ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}
                      >
                        <Heart 
                          className={`h-5 w-5 ${favorites.includes(job.id) ? 'fill-current' : ''}`} 
                        />
                      </Button>
                      <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                        {job.posted}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                    {job.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {job.salary}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {job.type}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300">
                      <Clock className="h-3 w-3 mr-1" />
                      {job.schedule}
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-300">
                      {job.experienceLevel}
                    </Badge>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      onClick={() => window.open(job.applyLink, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                    <Button 
                      variant="outline" 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                      onClick={() => toggleFavorite(job.id)}
                    >
                      {favorites.includes(job.id) ? 'Saved' : 'Save Job'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No jobs found for your search criteria.</p>
              <p className="text-gray-400 dark:text-gray-500 mt-2">Try adjusting your search terms or location.</p>
            </div>
          )}

          {/* Pagination */}
          {filteredJobs.length > 0 && totalPages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNumber);
                          }}
                          isActive={currentPage === pageNumber}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="h-6 w-6" />
                <span className="text-xl font-bold">JobSeeker</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500">
                Your gateway to career opportunities worldwide.
              </p>
              {/* Social Media Links */}
              <div className="flex space-x-4 mt-6">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career Advice</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resume Builder</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Post a Job</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Talent Solutions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center text-gray-400 dark:text-gray-500">
            <p>&copy; 2024 JobSeeker. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {/* {showModal && <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />} */}


      {/* Welcome Popup */}
      {showWelcomePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md text-center">
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to JobSeeker!</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Discover Hundread of job opportunities from top companies worldwide. Start your career journey today!
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  Browse 100+ job listings
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Heart className="h-4 w-4 text-red-500 mr-2" />
                  Save your favorite jobs
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Search className="h-4 w-4 text-blue-500 mr-2" />
                  Advanced search filters
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setShowWelcomePopup(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
