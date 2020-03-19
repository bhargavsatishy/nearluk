CREATE OR REPLACE Function fn_addCountry(param_countryName varchar(35),param_isdCode varchar(30),param_currencyName varchar(30),param_currencyCode varchar(30))
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 insert into Country (countryName, isdCode, currencyName, currencyCode) values( param_countryName, param_isdCode, param_currencyName, param_currencyCode) returning id into n;
 return n;
 end
 $BODY$;

CREATE OR REPLACE Function fn_addState(param_stateName varchar(35),param_countryId int)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 insert into State (stateName, countryId) values(param_stateName, param_countryId) returning id into n;
 return n;
 end
 $BODY$;

 CREATE OR REPLACE Function fn_addCity(param_cityName varchar(35),param_stateId int)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 insert into City ( cityName, stateId) values( param_cityName, param_stateId) returning id into n;
 return n;
 end
 $BODY$;

CREATE OR REPLACE Function fn_addArea(param_areaName varchar(500),param_zipCode varchar,param_cityId int)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 insert into Area (areaName, zipCode, cityId) values(param_areaName, param_zipCode, param_cityId) returning id into n;
 return n;
 end
 $BODY$;
																																   
--  CREATE OR REPLACE Function fn_addRegistration(param_name varchar(30),param_email varchar(50),param_mobile varchar,param_address text,param_gender varchar,param_occupation varchar,param_roleId int,param_dob varchar,param_status varchar,param_gmail_id varchar,param_areaId int)
--  returns integer
--  LANGUAGE plpgsql
--  COST 100
--  VOLATILE
--  AS $BODY$
-- declare n int;
--  begin
--  insert into Registration (name, email, mobile, address, gender, occupation, roleId, dob, status, gmail_id, areaId) values(param_name, param_email, param_mobile, param_address, param_gender, param_occupation, param_roleId, param_dob, param_status, param_gmail_id, param_areaId) returning id into n;
--  return n;
--  end
--  $BODY$;

-- CREATE OR REPLACE FUNCTION public.fn_addregistration(
-- 	param_name character varying,
-- 	param_email character varying,
-- 	param_mobile character varying,
-- 	param_address text,
-- 	param_gender character varying,
-- 	param_occupation character varying,
-- 	param_roleid integer,
-- 	param_dob character varying,
-- 	param_status character varying,
-- 	param_gmail_id character varying,
-- 	param_areaid integer,
-- 	param_isd character varying)
--     RETURNS integer
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
-- AS $BODY$

-- declare n int;
--  begin
--  insert into Registration (name, email, mobile, address, gender, occupation, roleId, dob, status, gmail_id, areaId, isd) values(param_name, param_email, param_mobile, param_address, param_gender, param_occupation, param_roleId, param_dob, param_status, param_gmail_id, param_areaId, param_isd) returning id into n;
--  return n;
--  end
 

-- $BODY$;


CREATE OR REPLACE FUNCTION public.fn_addregistration1(
	param_name character varying,
	param_email character varying,
	param_mobile character varying,
	param_address text,
	param_gender character varying,
	param_occupation character varying,
	param_roleid integer,
	param_dob character varying,
	param_status character varying,
	param_gmail_id character varying,
	param_areaid integer,
	param_isd character varying,
	param_verifymail character varying)
    RETURNS integer
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

declare n int;
 begin
 insert into Registration (name, email, mobile, address, gender, occupation, roleId, dob, status, gmail_id, areaId, isd, verifymail) values(param_name, param_email, param_mobile, param_address, param_gender, param_occupation, param_roleId, param_dob, param_status, param_gmail_id, param_areaId, param_isd,param_verifymail) returning id into n;
 return n;
 end
 
$BODY$;



 create or replace function fn_login(param_userid int,param_email varchar,param_password varchar)
returns int
as
$$
declare n int;
begin
insert into login(userid,email,password,status) values(param_userid,param_email,param_password,false)returning userid into n;
return n;
end
$$
language plpgsql;

 CREATE OR REPLACE Function fn_addpropertyTypes(param_propertyType varchar)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 insert into propertyTypes ( propertyType) values(param_propertyType) returning id into n;
 return n;
 end
 $BODY$;
 CREATE OR REPLACE Function fn_addFacility(param_facilityName varchar(50))
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 insert into Facility (facilityName) values(param_facilityName) returning id into n;
 return n;
 end
 $BODY$;
 CREATE OR REPLACE Function fn_addFacilityMapping(param_propertyTypeId int,param_facilityId int)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 insert into FacilityMapping ( propertyTypeId, facilityId) values( param_propertyTypeId, param_facilityId) returning id into n;
 return n;
 end
 $BODY$;



-- CREATE OR REPLACE FUNCTION public.fn_addpropertydetails(
-- 	param_userid integer,
-- 	param_propertytypeid integer,
-- 	param_propertyname character varying,
-- 	param_facing character varying,
-- 	param_price bigint,
-- 	param_description character varying,
-- 	param_nearlukverified character varying,
-- 	param_status character varying,
-- 	param_posteddate date,
-- 	param_propertyarea bigint,
-- 	param_constructionstatus character varying,
-- 	param_securitydeposit bigint,
-- 	param_maintainancecost bigint,
-- 	param_rentalperiod character varying,
-- 	param_communityid bigint,
-- 	param_available date,
-- 	param_age character varying)
--     RETURNS integer
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
-- AS $BODY$

-- declare n int;
--  begin
--  insert into PropertyDetails (userId, propertyTypeId, propertyName, facing, price, description, nearlukVerified, status, postedDate, propertyArea, constructionStatus, securityDeposit, maintainanceCost, rentalPeriod, communityId,available,age) values( param_userid, param_propertytypeid, param_propertyname, param_facing, param_price, param_description, param_nearlukverified, param_status, param_posteddate, param_propertyarea, param_constructionstatus, param_securitydeposit, param_maintainancecost, param_rentalperiod, param_communityid,param_available,param_age) returning id into n;
--  return n;
--  end
 

-- $BODY$;





-- CREATE OR REPLACE FUNCTION public.fn_addpropertydetails(
-- 	param_userid integer,
-- 	param_propertytypeid integer,
-- 	param_propertyname character varying,
-- 	param_facing character varying,
-- 	param_price bigint,
-- 	param_description character varying,
-- 	param_nearlukverified character varying,
-- 	param_status character varying,
-- 	param_posteddate date,
-- 	param_propertyarea bigint,
-- 	param_constructionstatus character varying,
-- 	param_securitydeposit bigint,
-- 	param_maintainancecost bigint,
-- 	param_rentalperiod character varying,
-- 	param_communityid bigint,
-- 	param_available date,
-- 	param_age character varying)
--     RETURNS integer
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
-- AS $BODY$

-- declare n int;
--  begin
--  insert into PropertyDetails (userId, propertyTypeId, propertyName, facing, price, description, nearlukVerified, status, postedDate, propertyArea, constructionStatus, securityDeposit, maintainanceCost, rentalPeriod, communityId,available,age) values( param_userid, param_propertytypeid, param_propertyname, param_facing, param_price, param_description, param_nearlukverified, param_status, param_posteddate, param_propertyarea, param_constructionstatus, param_securitydeposit, param_maintainancecost, param_rentalperiod, param_communityid,param_available,param_age) returning id into n;
--  return n;
--  end
 

-- $BODY$;


CREATE OR REPLACE FUNCTION public.fn_addpropertydetails(
	param_userid integer,
	param_propertytypeid integer,
	param_propertyname character varying,
	param_facing character varying,
	param_price bigint,
	param_description character varying,
	param_nearlukverified character varying,
	param_status character varying,
	param_posteddate date,
	param_propertyarea bigint,
	param_constructionstatus character varying,
	param_securitydeposit bigint,
	param_maintainancecost bigint,
	param_rentalperiod character varying,
	param_communityid bigint,
	param_available date,
	param_age character varying,
	param_preference character varying)
    RETURNS integer
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

declare n int;
 begin
 insert into PropertyDetails (userId, propertyTypeId, propertyName, facing, price, description, nearlukVerified, status, postedDate, propertyArea, constructionStatus, securityDeposit, maintainanceCost, rentalPeriod, communityId,available,age,Preference) values( param_userid, param_propertytypeid, param_propertyname, param_facing, param_price, param_description, param_nearlukverified, param_status, param_posteddate, param_propertyarea, param_constructionstatus, param_securitydeposit, param_maintainancecost, param_rentalperiod, param_communityid,param_available,param_age,param_preference) returning id into n;
 return n;
 end
 

$BODY$;

CREATE OR REPLACE FUNCTION public.fn_addpropertyaddress(
	propertyid integer,

	address character varying,
	pincode character varying,

	countryid integer,
	stateid integer,
	cityid integer,
	areaid integer,
	latitude numeric,
	longitude numeric)
    RETURNS integer
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
declare n int;
 begin
 insert into PropertyAddress  ( propertyId,address, pincode, countryId, stateId, cityId, areaId,latitude,longitude) values( propertyId, address, pincode,countryId, stateId, cityId, areaId,latitude,longitude) returning id into n;
 return n;
 end
 $BODY$;




 CREATE OR REPLACE Function fn_addPropertyAmenities(param_propertyAmenity varchar)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 insert into PropertyAmenities ( propertyAmenity) values( param_propertyAmenity) returning id into n;
 return n;
 end
 $BODY$;
 CREATE OR REPLACE Function fn_addAddPropertyAmenities(param_propertyId int,param_propertyAmenityId int,param_amenityValue varchar(30))
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 insert into AddPropertyAmenities ( propertyId, propertyAmenityId, amenityValue) values( param_propertyId, param_propertyAmenityId, param_amenityValue) returning id into n;
 return n;
 end
 $BODY$;
CREATE OR REPLACE Function fn_addAmenityMapping(param_propertyImenityId int,param_propertyTypeId int)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 insert into AmenityMapping ( propertyImenityId, propertyTypeId) values( param_propertyImenityId, param_propertyTypeId) returning id into n;
 return n;
 end
 $BODY$;
 

CREATE OR REPLACE FUNCTION public.fn_addfavourites(
	param_userid integer,
	param_propertyid integer)
    RETURNS integer
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
declare n int;
DECLARE property_user_id integer:=( select userid  from propertydetails where id = param_propertyid );
 begin
 insert into Favourites (userId, propertyId) values(param_userId, param_propertyId) returning id into n;
 insert into allNotifications(property_id,fromuser_id,touser_id,notification_type) values (param_propertyid,param_userid,property_user_id,'favourite');
 return n;
 end
 $BODY$;

 CREATE OR REPLACE Function fn_addTenantNotifications(param_propertyId int,param_fromUserId int,param_toUserId int,param_message varchar(300),param_notifyDate date,param_notificationType varchar(30),param_status varchar(10))
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 insert into TenantNotifications (propertyId, fromUserId, toUserId, message, notifyDate, notificationType, status) values(param_notificationId, param_propertyId, param_fromUserId, param_toUserId, param_message, param_notifyDate, param_notificationType, param_status) returning id into n;
 return n;
 end
 $BODY$;

 CREATE OR REPLACE Function fn_addAgentReview(param_agentUserId int,param_ownerUserId int,param_comment varchar(500),param_cmntDate date,param_rating int)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 insert into AgentReview (agentUserId, ownerUserId, comment, cmntDate, rating) values(param_agentUserId, param_ownerUserId, param_comment, param_cmntDate, param_rating) returning id into n;
 return n;
 end
 $BODY$;
 CREATE OR REPLACE Function fn_addOwnerAgent(param_propertyId int,param_agentUserId int,param_status varchar(10))
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 insert into OwnerAgent (propertyId, agentUserId, status) values(param_propertyId, param_agentUserId, param_status) returning id into n;
 return n;
 end
 $BODY$;
 CREATE OR REPLACE Function fn_addBidding(param_userId int,param_propertyId int,param_biddingPrice bigint,param_biddingDate date)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 insert into Bidding (userId, propertyId, biddingPrice, biddingDate) values(param_userId, param_propertyId, param_biddingPrice, param_biddingDate) returning id into n;
 return n;
 end
 $BODY$;



 CREATE OR REPLACE Function fn_addGatedCommunity(param_communityName varchar(40),param_communityDescription varchar(200))
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 insert into GatedCommunity (communityName, communityDescription) values(param_communityName, param_communityDescription) returning id into n;
 return n;
 end
 $BODY$;
 CREATE OR REPLACE Function fn_addContactUs(param_name varchar(50),param_email varchar(100),param_message varchar(1000),param_postedDate varchar(30),param_status varchar(5))
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 insert into ContactUs (name, email, message, postedDate, status) values(param_contactId, param_name, param_email, param_message, param_postedDate, param_status) returning id into n;
 return n;
 end
 $BODY$;
 CREATE OR REPLACE Function fn_addAddPropertyFacilities(param_propertyId int,param_facilityId int)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 insert into AddPropertyFacilities (propertyId, facilityId) values(param_propertyId, param_facilityId) returning id into n;
 return n;
 end
 $BODY$;
 CREATE OR REPLACE Function fn_addDomainlogs(param_logheader varchar(70),param_logcode varchar(70),param_logtype varchar(70),param_message varchar(70),param_loggedfor varchar(70),param_status boolean)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 insert into Domainlogs (logheader, logcode, logtype, message, loggedfor, status) values(param_logheader, param_logcode, param_logtype,param_message, param_loggedfor, param_status) returning id into n;
 return n;
 end
 $BODY$;
 
create or replace function fn_adduserlogin(param_userid int)returns text
as
$$
declare m text;
declare i text;
begin
SELECT md5(random()::text || clock_timestamp()::text)::uuid into m;
insert into userlogin(userid,session,accesstime)values(param_userid,m,current_timestamp) on conflict (userid)
do update set session=m,accesstime=current_timestamp returning session into i;
return i;
end
$$
language plpgsql;
 
 CREATE OR REPLACE Function fn_addAuthentication(param_userid int,param_email varchar(50),param_password varchar(50),param_lastaccess timestamp with time zone,param_lastunsuccessfulaccess timestamp with time zone,param_initiallogin timestamp with time zone,param_lastmodified timestamp with time zone,param_successfullogins int,param_loginsfailed int,param_loginsfreq int,param_online varchar,param_devicetype varchar,param_accessedip text)
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 insert into Authentication (userid, email, password, lastaccess, lastunsuccessfulaccess, initiallogin, lastmodified, successfullogins, loginsfailed, loginsfreq, online, devicetype, accessedip) values(param_userid, param_email, param_password, param_lastaccess, param_lastunsuccessfulaccess, param_initiallogin, param_lastmodified, param_successfullogins, param_loginsfailed, param_loginsfreq, param_online, param_devicetype, param_accessedip) returning id into n;
 return n;
 end
 $BODY$;
 
 CREATE OR REPLACE Function fn_addPropertyViews(propertyId int,userId int,date varchar(30))
 returns integer
 LANGUAGE plpgsql
 COST 100
 VOLATILE
 AS $BODY$
declare n int;
 begin
 insert into PropertyViews (propertyId, userId, date) values(propertyId, userId, date) returning id into n;
 return n;
 end
 $BODY$;

CREATE OR REPLACE FUNCTION public.fn_bidding_insert(
	userid integer,
	propertyid integer,
	biddingprice bigint,
	biddingdate date)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
DECLARE property_user_id integer:=( select s.userid  from propertydetails s where id = propertyid );

begin
insert into bidding(userid,propertyid,biddingPrice,biddingdate)values
(userid,propertyid,biddingPrice,biddingdate);
 insert into allNotifications(property_id,fromuser_id,touser_id,notification_type) values (propertyid,userid,property_user_id,'bidding');

end
$BODY$;


-- agent


CREATE OR REPLACE FUNCTION public.fn_tenantnotificationsadd(
	param_propertyid int,
	param_fromuserid int,
	param_touserid int,
	param_message character varying,
	param_notifydate date,
	param_notificationtype character varying,
	param_status character varying)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
begin
insert into tenantnotifications(propertyid,fromuserid,touserid,message,notifydate,notificationtype,status) values(param_propertyid,param_fromuserid,param_touserid,param_message,param_notifydate,param_notificationtype,param_status);
end
$BODY$;







CREATE OR REPLACE FUNCTION public.fn_owneraddagentinsert(
	param_propertyid int,
	param_agentuserid int,
	param_status character varying)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

begin
insert into owneragent(propertyid,agentuserid,status)values(param_propertyid,param_agentuserid,param_status);
end

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_post_property_amenities_insert(
	pid integer,
	property_amenity_id integer,
	amenityvalue character varying)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

begin
insert into addpropertyamenities(propertyid,propertyamenityid,amenityvalue) values(pid,property_amenity_id,amenityvalue);											
end

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_post_property_facilities_insert(
	property_id integer,
	facility_id bigint)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

begin
insert into addpropertyfacilities(propertyid,facilityid) values(property_id,facility_id);
end

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_contactus_insert(
	name character varying,
	email character varying,
	message character varying,
	status character varying,
	posteddate character varying)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
begin
insert into contactus(name,email,message,posteddate,status) values(name,email,message,posteddate,status);
end
$BODY$;


CREATE OR REPLACE FUNCTION public.fn_bidding_notification_insert(
	propertyid integer,
	fromuserid integer,
	touserid bigint,
	message varchar,
	notifydate date,
	notificationtype varchar,
	status varchar)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$


begin
insert into tenantnotifications(propertyid,fromuserid,touserid,message,notifydate,notificationtype,status)values
(propertyid,fromuserid,touserid,message,notifydate,notificationtype,status);
end

$BODY$;





CREATE OR REPLACE FUNCTION public.fn_insertarea(
	country_iid integer,
	state_iid integer,
	city_iid integer,
	area_name character varying,
	zip_code character varying)
    RETURNS TABLE(country_id integer, state_id integer, city_id integer, area_id integer) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

declare coid int;
declare sid int;
declare cid int;
declare aid int;

 begin
 

	 
	   select max(id+1)  into aid from area;
	   		  insert into area(id,areaname,zipcode,cityid) values(aid,area_name,zip_code,city_iid);

 
 
 
 return query   select  country_iid,state_iid,city_iid,aid;
 end
 

$BODY$;






CREATE OR REPLACE FUNCTION public.fn_insertcityarea(
	country_iid integer,
	state_iid integer,
	city_name character varying,
	area_name character varying,
	zip_code character varying)
    RETURNS TABLE(country_id integer, state_id integer, city_id integer, area_id integer) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

declare coid int;
declare sid int;
declare cid int;
declare aid int;

 begin
 

  
  select max(id+1)  into cid from city;
  
  	 insert into city(id,cityname,stateid) values(cid,city_name,state_iid);
	 
	   select max(id+1)  into aid from area;
	   		  insert into area(id,areaname,zipcode,cityid) values(aid,area_name,zip_code,cid);

 
 
 
 return query   select  country_iid,state_iid,cid,aid;
 end
 

$BODY$;





CREATE OR REPLACE FUNCTION public.fn_insertstatecityarea(
	country_iid integer,
	state_name character varying,
	city_name character varying,
	area_name character varying,
	zip_code character varying)
    RETURNS TABLE(country_id integer, state_id integer, city_id integer, area_id integer) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

declare coid int;
declare sid int;
declare cid int;
declare aid int;

 begin
 

 
 select max(id+1)  into sid from state;
 
  insert into state(id,statename,countryid) values(sid,state_name,country_iid);
  
  select max(id+1)  into cid from city;
  
  	 insert into city(id,cityname,stateid) values(cid,city_name,sid);
	 
	   select max(id+1)  into aid from area;
	   		  insert into area(id,areaname,zipcode,cityid) values(aid,area_name,zip_code,cid);

 
 
 
 return query   select  country_iid,sid,cid,aid;
 end
 

$BODY$;





CREATE OR REPLACE FUNCTION public.fn_insertcountrystatecityarea(
	country_name character varying,
	state_name character varying,
	city_name character varying,
	area_name character varying,
	zip_code character varying)
    RETURNS TABLE(country_id integer, state_id integer, city_id integer, area_id integer) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

declare coid int;
declare sid int;
declare cid int;
declare aid int;

 begin
 
 select max(id+1)  into coid from country;
 
 
 insert into country(id,countryname) values(coid,country_name);
 
 select max(id+1)  into sid from state;
 
  insert into state(id,statename,countryid) values(sid,state_name,coid);
  
  select max(id+1)  into cid from city;
  
  	 insert into city(id,cityname,stateid) values(cid,city_name,sid);
	 
	   select max(id+1)  into aid from area;
	   		  insert into area(id,areaname,zipcode,cityid) values(aid,area_name,zip_code,cid);

 
 
 
 return query   select  coid,sid,cid,aid;
 end
 

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_enquiryforminsert(
	user_id integer,
	property_type_id bigint,
	min_price bigint,
	max_price bigint,
	facing character varying,
	country bigint,
	state bigint,
	city bigint,
	area bigint)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

begin
insert into enquiryForm(userId,propertyTypeId,minPrice,maxPrice,facing,country,state,city,area)values(user_id,property_type_id,min_price,max_price,facing,country,state,city,area);
end

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_addchatmapp(
	param_userid1 integer,
	param_userid2 integer,
propertydid integer)
    RETURNS integer
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
declare n int;
 begin
 insert into chatmapping(user1,user2,time,propertyid)values (param_userid1,param_userid2,current_timestamp,propertydid) returning cmsid into n;
 return n;
 end
 $BODY$;




