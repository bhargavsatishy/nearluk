create table RoleMaster(id serial primary key, name varchar(20));
insert into rolemaster (name) values ('Owner/Tenant');
-- insert into rolemaster (name) values ('Tenant');
insert into rolemaster (name) values ('Agent');
insert into rolemaster (name) values ('Admin');
create table Country(Id int primary key, countryName varchar(35), isdCode varchar(30), currencyName varchar(30), currencyCode varchar(30));
create table State(Id int primary key, stateName varchar(35), countryId int references country(id));
create table City(Id bigint primary key, cityName varchar(35), stateId int references state(id));
create table Area(Id bigint primary key, areaName varchar(500), zipCode varchar, cityId int references city(id));
create table Registration(Id serial primary key, name varchar(30), email varchar(50), mobile varchar, address text, gender varchar, occupation varchar, roleId int references rolemaster(id), dob varchar, status varchar, gmail_id varchar, areaId int references area(id),isd varchar(10),verifymail varchar(15));
insert into registration (name,mobile,roleid,status) values('Admin','0000000000',3,'Verified');
create table login(id serial primary key,userid int references registration(id),email varchar,mobile varchar,password varchar,status boolean);
insert into login(userid,mobile,password,status) values(1,'0000000000','123456',false);
create table propertyTypes(Id serial primary key, propertyType varchar);
create table Facility(Id serial primary key, facilityName varchar(50));
create table FacilityMapping(Id serial primary key, propertyTypeId int references propertyTypes(id), facilityId int references Facility(id));
create table GatedCommunity(Id serial primary key, communityName varchar(40), communityDescription varchar(200));																																		
create table PropertyDetails(Id serial primary key, userId int references registration(id) NOT NULL, propertyTypeId int references propertyTypes(id), propertyName varchar(80), facing varchar, price bigint, description varchar(235), nearlukVerified varchar, status varchar, postedDate date, propertyArea bigint, constructionStatus varchar, securityDeposit bigint, maintainanceCost bigint, rentalPeriod varchar, communityId int references GatedCommunity(id),available date,age varchar(20),Preference varchar(50));
create table PropertyAmenities(Id serial primary key, propertyAmenity varchar);
create table AddPropertyAmenities(Id serial primary key, propertyId int references PropertyDetails(Id), propertyAmenityId int references PropertyAmenities(Id), amenityValue varchar(30));
create table AmenityMapping(Id serial primary key, propertyAmenityId int references PropertyAmenities(Id), propertyTypeId int references propertyTypes(Id));
create table PropertyAddress(Id serial primary key, propertyId int references PropertyDetails(Id), addressProofType varchar(30), addressProofId varchar(50), address varchar(200), pincode varchar(30),landmarks varchar(30), countryId int references country(Id), stateId int references state(Id), cityId int references city(Id), areaId int references area(id),latitude numeric,longitude numeric);
create table Rating(Id serial primary key, propertyId int references PropertyDetails(Id), rating int, userId int references registration(id), comment varchar(200));
create table Favourites(Id serial primary key, userId int references registration(id), propertyId int references PropertyDetails(Id));
create table TenantNotifications(Id serial primary key, propertyId int references PropertyDetails(Id), fromUserId int references registration(id), toUserId int references registration(id), message varchar(300), notifyDate date, notificationType varchar(30), status varchar(10));
create table AgentReview(Id serial primary key, agentUserId int references registration(id), ownerUserId int references registration(id), comment varchar(500), cmntDate date, rating int);
create table OwnerAgent(Id serial primary key, propertyId int references PropertyDetails(Id), agentUserId int references registration(id), status varchar(10));
create table Bidding(bidId serial primary key, userId int references registration(id), propertyId int references PropertyDetails(Id), biddingPrice bigint, biddingDate date);
create table AddPropertyFacilities(Id serial primary key, propertyId int references PropertyDetails(Id), facilityId int references Facility(Id));
create table PropertyLikes(Id serial primary key, propertyId int references PropertyDetails(Id), userId int references registration(id), likesStatus bigint);
create table ContactUs(Id serial primary key, name varchar(50), email varchar(100), message varchar(1000), postedDate varchar(30), status varchar(5));
create table PropertyViews(Id serial primary key, propertyId int references PropertyDetails(Id), userId int references registration(id), date varchar(30),contactviewed varchar(10));
create table Domainlogs(Id serial primary key, logheader varchar(70), logcode varchar(70), logtype varchar(70), message varchar(70), loggedfor varchar(70), status boolean);
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
create table UserLogin(userid int references registration(id) unique,session text unique, accessTime timestamp with time zone);
create table Authentication(id serial primary key, userid int references registration(id), email varchar(50), password varchar(50), lastaccess timestamp with time zone, lastunsuccessfulaccess timestamp with time zone, initiallogin timestamp with time zone, lastmodified timestamp with time zone, successfullogins int, loginsfailed int, loginsfreq int, online varchar, devicetype varchar, accessedip text);
create table agentdiscription(id int references registration(id),discription varchar(500));
create table enquiryForm(
userId integer,
	propertyTypeId bigint,
	minPrice bigint,
	maxPrice bigint,
	facing character varying,
	country bigint,
	state bigint,
	city bigint,
	area bigint);

CREATE SEQUENCE public.lu_allnotifications_seq_notification_id;

CREATE TABLE public.allnotifications
(
    notification_id integer NOT NULL DEFAULT nextval('lu_allnotifications_seq_notification_id'::regclass),
    property_id integer,
    fromuser_id integer,
    touser_id integer,
    status boolean DEFAULT false,
    notification_type character varying COLLATE pg_catalog."default",
    created_on timestamp without time zone DEFAULT now(),
    CONSTRAINT allnotifications_id_pkey PRIMARY KEY (notification_id),
    CONSTRAINT allnotifications_fromuserid_fkey FOREIGN KEY (fromuser_id)
        REFERENCES public.registration (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT allnotifications_id_fkey FOREIGN KEY (property_id)
        REFERENCES public.propertydetails (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT allnotifications_touserid_fkey FOREIGN KEY (touser_id)
        REFERENCES public.registration (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

create table featuredproperty (fid serial primary key, featurename varchar(50));

create table featuredpropertyMapping(Id serial primary key, propertyTypeId int references propertyTypes(id), fid int references featuredproperty(fid));

ALTER TABLE public.allnotifications ALTER COLUMN notification_id SET DEFAULT nextval('public.lu_allnotifications_seq_notification_id');

select max(notification_id  ) from public.allnotifications  ;

alter sequence public.lu_allnotifications_seq_notification_id restart with 1;

create table moversandpackersandloan(id serial,itemid int,name varchar(50),link varchar(700));


create table chatmapping( cmsid serial primary key, user1 bigint references registration(id),
    user2 bigint references registration(id),propertyid bigint references propertydetails(id),time  timestamp with time zone);


create table chatnotification(cnsid serial,cmsid integer references chatmapping(cmsid),fromuser bigint references registration(id),touser bigint references registration(id),ncount bigint);

	create table chat( msid serial, fromuserid bigint references registration(id),
    touserid bigint references registration(id),message character varying(1000),chatmapp bigint references chatmapping(cmsid));
	
	
	create table appchatnotification(apcsid serial,userid integer unique references registration(id),ancount bigint);
