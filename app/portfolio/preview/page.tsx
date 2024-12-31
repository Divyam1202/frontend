"use client";
import React, { useEffect, useState } from "react";
//icons
import AiIcon from "@/app/components/icons/Ai";
import AirflowIcon from "@/app/components/icons/airflow";
import AmazonWebServicesIcon from "@/app/components/icons/amazon-web-services";
import AndroidDevelopmentIcon from "@/app/components/icons/android-dev";
import AngularJsIcon from "@/app/components/icons/angularjs";
import AnsibleIcon from "@/app/components/icons/ansible";
import ArduinoIcon from "@/app/components/icons/arduino";
import AwsDynamoDbIcon from "@/app/components/icons/awsdynamodb";
import AzureIcon from "@/app/components/icons/azure";
import BitbucketIcon from "@/app/components/icons/bitbucket";
import BlenderIcon from "@/app/components/icons/blender";
import BlockchainIcon from "@/app/components/icons/blockchain";
import BootstrapIcon from "@/app/components/icons/bootstrap";
import CIcon from "@/app/components/icons/c";
import CPlusPlusIcon from "@/app/components/icons/c++";
import CSharpIcon from "@/app/components/icons/c#";
import CassandraIcon from "@/app/components/icons/cassandra";
import CiscoIcon from "@/app/components/icons/cisco";
import ComsolIcon from "@/app/components/icons/comsol";
import Css3Icon from "@/app/components/icons/css3";
import DatabricksIcon from "@/app/components/icons/databricks";
import DeeplearningIcon from "@/app/components/icons/deeplearning";
import DjangoIcon from "@/app/components/icons/django";
import DockerIcon from "@/app/components/icons/docker";
import DVCIcon from "@/app/components/icons/dvc";
import ElasticsearchIcon from "@/app/components/icons/elasticsearch";
import ElectronicsPcbIcon from "@/app/components/icons/electronics-pcb";
import EthicalHackingIcon from "@/app/components/icons/ethical-hacking";
import ExpressjsIcon from "@/app/components/icons/expressjs";
import FigmaIcon from "@/app/components/icons/figma";
import FirebaseIcon from "@/app/components/icons/firebase";
import FlaskIcon from "@/app/components/icons/flask";
import FlutterIcon from "@/app/components/icons/flutter";
import GitIcon from "@/app/components/icons/git";
import GithubIcon from "@/app/components/icons/github";
import GitlabIcon from "@/app/components/icons/gitlab";
import GoIcon from "@/app/components/icons/go";
import GodotIcon from "@/app/components/icons/godot";
import GolangIcon from "@/app/components/icons/golang";
import GoogleBigQuerryIcon from "@/app/components/icons/goolebigquerry";
import GoogleCloudIcon from "@/app/components/icons/googlecloud";
import HackerrankIcon from "@/app/components/icons/hackerrank";
import HadoopIcon from "@/app/components/icons/hadoop";
import Html5Icon from "@/app/components/icons/html5";
import HuggingfaceIcon from "@/app/components/icons/huggingface";
import IonicIcon from "@/app/components/icons/ionic";
import JavaIcon from "@/app/components/icons/java";
import JavaScriptIcon from "@/app/components/icons/javascript";
import JenkinsIcon from "@/app/components/icons/jenkins";
import JupyterIcon from "@/app/components/icons/jupyter";
import KafkaIcon from "@/app/components/icons/kafka";
import KerasIcon from "@/app/components/icons/keras";
import KotlinIcon from "@/app/components/icons/kotlin";
import KubeflowIcon from "@/app/components/icons/kubeflow";
import KubernetsIcon from "@/app/components/icons/kubernets";
import LeetCodeIcon from "@/app/components/icons/leetcode";
import LinuxIcon from "@/app/components/icons/linux";
import MatlabIcon from "@/app/components/icons/matlab";
import MeteorIcon from "@/app/components/icons/meteor";
import MicrosoftDirectXIcon from "@/app/components/icons/msdirectx";
import MicrosoftSQLServerIcon from "@/app/components/icons/mssqlserver";
import MicrosoftNetIcon from "@/app/components/icons/msnet";
import MachineLearningIcon from "@/app/components/icons/ml";
import MLflowIcon from "@/app/components/icons/mlflow";
import MongoDBIcon from "@/app/components/icons/mongodb";
import MySQLIcon from "@/app/components/icons/mysql";
import Neo4jIcon from "@/app/components/icons/neo4j";
import NextJSIcon from "@/app/components/icons/nextjs";
import NlpIcon from "@/app/components/icons/nlp";
import NodeJSIcon from "@/app/components/icons/nodejs";
import NumpyIcon from "@/app/components/icons/numpy";
import OpenCVIcon from "@/app/components/icons/opencv";
import OpenGLIcon from "@/app/components/icons/opengl";
import OpenShiftIcon from "@/app/components/icons/openshift";
import OracleDBIcon from "@/app/components/icons/oracledb";
import PandasIcon from "@/app/components/icons/pandas";
import PostgreSQLIcon from "@/app/components/icons/postgresql";
import PythonIcon from "@/app/components/icons/python";
import PyTorchIcon from "@/app/components/icons/pytorch";
import RIcon from "@/app/components/icons/r";
import RailsIcon from "@/app/components/icons/rails";
import RaspberryPiIcon from "@/app/components/icons/raspberrypi";
import ReactNativeIcon from "@/app/components/icons/reactnative";
import ReactIcon from "@/app/components/icons/react";
import RedisIcon from "@/app/components/icons/redis";
import ReduxIcon from "@/app/components/icons/redux";
import RoboticsIcon from "@/app/components/icons/robotics";
import RubyIcon from "@/app/components/icons/ruby";
import ScalaIcon from "@/app/components/icons/scala";
import ScikitLearnIcon from "@/app/components/icons/scikitlearn";
import SeabornIcon from "@/app/components/icons/seaborn";
import SolidWorksIcon from "@/app/components/icons/solidworks";
import SpringBootIcon from "@/app/components/icons/spring";
import SvelteIcon from "@/app/components/icons/svelte";
import SVNIcon from "@/app/components/icons/svn";
import SwiftIcon from "@/app/components/icons/swift";
import TailwindCSSIcon from "@/app/components/icons/tailwindcss";
import TensorFlowIcon from "@/app/components/icons/tensorflow";
import TerraformIcon from "@/app/components/icons/terraform";
import ThreeJSIcon from "@/app/components/icons/threejs";
import TypeScriptIcon from "@/app/components/icons/typescript";
import UnityIcon from "@/app/components/icons/unity";
import UnrealIcon from "@/app/components/icons/unreal";
import VerilogIcon from "@/app/components/icons/verilog";
import VirtualRealityIcon from "@/app/components/icons/virtualreact";
import VscodeIcon from "@/app/components/icons/vscode";
import VuejsIcon from "@/app/components/icons/vuejs";
import XamarinIcon from "@/app/components/icons/xamarin";

// Import more icons as needed

type Skill =
  | string
  | {
      name: string;
      icon: React.ReactNode;
    };

type Project = {
  name: string;
  description: string;
  technologies: string[];
  link: string;
};

type Experience = {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

type Education = {
  institution: string;
  degree: string;
  graduationYear: string;
  major: string;
};

type Portfolio = {
  displayName: string;
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
};

// Predefined skill icons
const SKILL_ICONS: Record<string, React.ReactNode> = {
  react: <ReactIcon className="h-8 w-8" />,
  ai: <AiIcon className="h-8 w-8" />,
  airflow: <AirflowIcon className="h-8 w-8" />,
  amazonwebservices: <AmazonWebServicesIcon className="h-8 w-8" />,
  androiddevelopment: <AndroidDevelopmentIcon className="h-8 w-8" />,
  angularjs: <AngularJsIcon className="h-8 w-8" />,
  ansible: <AnsibleIcon className="h-8 w-8" />,
  arduino: <ArduinoIcon className="h-8 w-8" />,
  awsdynamodb: <AwsDynamoDbIcon className="h-8 w-8" />,
  azure: <AzureIcon className="h-8 w-8" />,
  bitbucket: <BitbucketIcon className="h-8 w-8" />,
  blender: <BlenderIcon className="h-8 w-8" />,
  blockchain: <BlockchainIcon className="h-8 w-8" />,
  bootstrap: <BootstrapIcon className="h-8 w-8" />,
  c: <CIcon className="h-8 w-8" />,
  cplusplus: <CPlusPlusIcon className="h-8 w-8" />,
  csharp: <CSharpIcon className="h-8 w-8" />,
  cassandra: <CassandraIcon className="h-8 w-8" />,
  cisco: <CiscoIcon className="h-8 w-8" />,
  comsol: <ComsolIcon className="h-8 w-8" />,
  css3: <Css3Icon className="h-8 w-8" />,
  databricks: <DatabricksIcon className="h-8 w-8" />,
  deeplearning: <DeeplearningIcon className="h-8 w-8" />,
  django: <DjangoIcon className="h-8 w-8" />,
  docker: <DockerIcon className="h-8 w-8" />,
  dvc: <DVCIcon className="h-8 w-8" />,
  elasticsearch: <ElasticsearchIcon className="h-8 w-8" />,
  electronicspcb: <ElectronicsPcbIcon className="h-8 w-8" />,
  ethicalhacking: <EthicalHackingIcon className="h-8 w-8" />,
  expressjs: <ExpressjsIcon className="h-8 w-8" />,
  figma: <FigmaIcon className="h-8 w-8" />,
  firebase: <FirebaseIcon className="h-8 w-8" />,
  flask: <FlaskIcon className="h-8 w-8" />,
  flutter: <FlutterIcon className="h-8 w-8" />,
  git: <GitIcon className="h-8 w-8" />,
  github: <GithubIcon className="h-8 w-8" />,
  gitlab: <GitlabIcon className="h-8 w-8" />,
  go: <GoIcon className="h-8 w-8" />,
  godot: <GodotIcon className="h-8 w-8" />,
  golang: <GolangIcon className="h-8 w-8" />,
  googlebigquerry: <GoogleBigQuerryIcon className="h-8 w-8" />,
  googlecloud: <GoogleCloudIcon className="h-8 w-8" />,
  hackerrank: <HackerrankIcon className="h-8 w-8" />,
  hadoop: <HadoopIcon className="h-8 w-8" />,
  html5: <Html5Icon className="h-8 w-8" />,
  huggingface: <HuggingfaceIcon className="h-8 w-8" />,
  ionic: <IonicIcon className="h-8 w-8" />,
  java: <JavaIcon className="h-8 w-8" />,
  javascript: <JavaScriptIcon className="h-8 w-8" />,
  jenkins: <JenkinsIcon className="h-8 w-8" />,
  jupyter: <JupyterIcon className="h-8 w-8" />,
  kafka: <KafkaIcon className="h-8 w-8" />,
  keras: <KerasIcon className="h-8 w-8" />,
  kotlin: <KotlinIcon className="h-8 w-8" />,
  kubeflow: <KubeflowIcon className="h-8 w-8" />,
  kubernets: <KubernetsIcon className="h-8 w-8" />,
  leetcode: <LeetCodeIcon className="h-8 w-8" />,
  linux: <LinuxIcon className="h-8 w-8" />,
  matlab: <MatlabIcon className="h-8 w-8" />,
  meteor: <MeteorIcon className="h-8 w-8" />,
  microsoftdirectx: <MicrosoftDirectXIcon className="h-8 w-8" />,
  microsoftsqlserver: <MicrosoftSQLServerIcon className="h-8 w-8" />,
  microsoftnet: <MicrosoftNetIcon className="h-8 w-8" />,
  machinelearning: <MachineLearningIcon className="h-8 w-8" />,
  mlflow: <MLflowIcon className="h-8 w-8" />,
  mongodb: <MongoDBIcon className="h-8 w-8" />,
  mysql: <MySQLIcon className="h-8 w-8" />,
  neo4j: <Neo4jIcon className="h-8 w-8" />,
  nextjs: <NextJSIcon className="h-8 w-8" />,
  nlp: <NlpIcon className="h-8 w-8" />,
  nodejs: <NodeJSIcon className="h-8 w-8" />,
  numpy: <NumpyIcon className="h-8 w-8" />,
  opencv: <OpenCVIcon className="h-8 w-8" />,
  opengl: <OpenGLIcon className="h-8 w-8" />,
  openshift: <OpenShiftIcon className="h-8 w-8" />,
  oracledb: <OracleDBIcon className="h-8 w-8" />,
  pandas: <PandasIcon className="h-8 w-8" />,
  postgresql: <PostgreSQLIcon className="h-8 w-8" />,
  python: <PythonIcon className="h-8 w-8" />,
  pytorch: <PyTorchIcon className="h-8 w-8" />,
  r: <RIcon className="h-8 w-8" />,
  rails: <RailsIcon className="h-8 w-8" />,
  raspberrypi: <RaspberryPiIcon className="h-8 w-8" />,
  reactnative: <ReactNativeIcon className="h-8 w-8" />,
  redis: <RedisIcon className="h-8 w-8" />,
  redux: <ReduxIcon className="h-8 w-8" />,
  robotics: <RoboticsIcon className="h-8 w-8" />,
  ruby: <RubyIcon className="h-8 w-8" />,
  scala: <ScalaIcon className="h-8 w-8" />,
  scikitlearn: <ScikitLearnIcon className="h-8 w-8" />,
  seaborn: <SeabornIcon className="h-8 w-8" />,
  solidworks: <SolidWorksIcon className="h-8 w-8" />,
  spring: <SpringBootIcon className="h-8 w-8" />,
  svelte: <SvelteIcon className="h-8 w-8" />,
  svn: <SVNIcon className="h-8 w-8" />,
  swift: <SwiftIcon className="h-8 w-8" />,
  tailwindcss: <TailwindCSSIcon className="h-8 w-8" />,
  tensorflow: <TensorFlowIcon className="h-8 w-8" />,
  terraform: <TerraformIcon className="h-8 w-8" />,
  threejs: <ThreeJSIcon className="h-8 w-8" />,
  typescript: <TypeScriptIcon className="h-8 w-8" />,
  unity: <UnityIcon className="h-8 w-8" />,
  unreal: <UnrealIcon className="h-8 w-8" />,
  verilog: <VerilogIcon className="h-8 w-8" />,
  virtualReality: <VirtualRealityIcon className="h-8 w-8" />,
  vscode: <VscodeIcon className="h-8 w-8" />,
  vuejs: <VuejsIcon className="h-8 w-8" />,
  xamarin: <XamarinIcon className="h-8 w-8" />,

  // Add more icons here
  fallback: <span>🌟</span>, // Default fallback for missing icons
};

export default function EnhancedPreviewPage() {
  const [profile, setProfile] = useState<Portfolio | null>(null);
  const [activeSection, setActiveSection] = useState<string>("about");

  useEffect(() => {
    const storedProfile = localStorage.getItem("savedProfile");
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  if (!profile) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            No profile found. Please save your profile first.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-12 px-4 lg:px-16 max-w-7xl">
        {/* Navigation */}
        <nav className="mb-12 flex justify-center space-x-6">
          {["about", "skills", "projects", "experience", "education"].map(
            (section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`capitalize flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  activeSection === section
                    ? "bg-blue-500 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700"
                }`}
              >
                {section}
              </button>
            )
          )}
        </nav>

        {/* Header Section */}
        {activeSection === "about" && (
          <header className="text-center mb-16">
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              {profile.displayName}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Welcome to my digital portfolio! I'm passionate about creating
              innovative solutions and pushing the boundaries of technology.
            </p>
          </header>
        )}

        {/* Skills Section */}
        {activeSection === "skills" && (
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-500">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
              Skills
            </h2>
            <div className="flex flex-wrap gap-6 justify-center">
              {profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => {
                  const skillName =
                    typeof skill === "string"
                      ? skill.toLowerCase()
                      : skill.name.toLowerCase();
                  const skillIcon =
                    SKILL_ICONS[skillName] || SKILL_ICONS["fallback"];

                  return (
                    <div
                      key={index}
                      title={skillName}
                      className="text-4xl p-4 bg-blue-50 dark:bg-gray-500 rounded-full hover:bg-blue-200 dark:hover:bg-red-400 hover:scale-105 transition-all transform m-3"
                    >
                      {skillIcon}
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No skills found</p>
              )}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {activeSection === "projects" && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {profile.projects.map((project, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 flex items-center justify-between">
                    {project.name}
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
                    >
                      ↗
                    </a>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {project.description}
                  </p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Technologies:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(project.technologies) &&
                      project.technologies.length > 0 ? (
                        project.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-2 py-1 rounded-full hover:bg-blue-300 transition-colors duration-300"
                          >
                            {tech}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          No technologies listed.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Experience Section */}
        {activeSection === "experience" && (
          <section className="space-y-6">
            {profile.experience.map((exp, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-between">
                  {exp.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  {exp.company} - {exp.location}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {exp.startDate} - {exp.endDate || "Present"}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {exp.description}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* Education Section */}
        {activeSection === "education" && (
          <section className="space-y-6">
            {profile.education.map((edu, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-between">
                  {edu.institution}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  {edu.degree} in {edu.major}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Graduated: {edu.graduationYear}
                </p>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
