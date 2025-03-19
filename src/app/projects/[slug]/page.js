'use client'
import ProjectDetail from '@/components/projects/ProjectDetail'
import React from 'react'
import { useParams } from 'next/navigation'


const ProjectPage = () => {

    const params = useParams();
    const projectId = params.slug;
    console.log("params id", projectId)
    
    return (
        <div className={`min-h-screen w-full mx-auto md:pt-32 py-16 
            text-white`}
        >   

            <ProjectDetail projectId={projectId} />
        </div>
    );
}

export default ProjectPage;