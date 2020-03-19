
CREATE OR REPLACE VIEW public.vw_getpropertynamebycityide AS
 SELECT d.posteddate,
    a.areaid,
    d.price,
    a.stateid,
    a.cityid,
    d.propertyname,
    t.propertytype,
    r.areaname,
    c.cityname
   FROM propertyaddress a
     JOIN propertydetails d ON a.propertyid = d.id
     JOIN propertytypes t ON t.id = d.propertytypeid
     JOIN area r ON a.areaid = r.id
     JOIN city c ON a.cityid = c.id;


-- CREATE OR REPLACE FUNCTION public.fn_viewuserid(
-- 	usersession text )
--     RETURNS TABLE(userid int,roleid int) 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin 
-- return query SELECT userlogin.userid, registration.roleid
-- FROM userlogin
-- INNER JOIN registration ON userlogin.userid=registration.id where session=userSession;
-- end
-- $BODY$;



-- CREATE OR REPLACE FUNCTION public.fn_viewuserid(
-- 	usersession text)
--     RETURNS TABLE(userid integer, roleid integer, appncount bigint) 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin 
-- return query SELECT userlogin.userid, registration.roleid,apc.ancount
-- FROM userlogin
-- INNER JOIN registration ON userlogin.userid=registration.id left JOIN appchatnotification apc ON userlogin.userid=apc.userid where session=usersession;
-- end
-- $BODY$;


CREATE OR REPLACE FUNCTION public.fn_viewuserid(
	usersession text)
    RETURNS TABLE(userid integer, roleid integer, appncount bigint) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query SELECT userlogin.userid, registration.roleid,apc.ancount
FROM userlogin
INNER JOIN registration ON userlogin.userid=registration.id left JOIN appchatnotification apc ON userlogin.userid=apc.userid where session=usersession;
end
$BODY$;



-- agent


CREATE OR REPLACE VIEW public.vw_notificationsgetbyusername AS
 SELECT n.propertyid,
    n.fromuserid,
    n.touserid,
    n.message,
    n.notificationtype,
    n.status,
    n.id,
    p.propertyname,
    r.name,
    r.email
   FROM tenantnotifications n
     JOIN propertydetails p ON p.id = n.propertyid
     JOIN registration r ON n.fromuserid = r.id;


CREATE OR REPLACE FUNCTION public.fn_getnotificationsbyusername(
	to_userid integer)
    RETURNS TABLE(notification_id integer, property_id integer, fromuser_id integer, touser_id integer, status boolean, notification_type character varying, created_on timestamp without time zone, name character varying, propertyname character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin 
return query 

select n.*,r.name,p.propertyname from public.allnotifications as n 
join public.registration as r on n.fromuser_id= r.id
join public.propertydetails as p on n.property_id=p.id where n.touser_id= to_userid ORDER BY n.created_on desc;
-- update public.allnotifications as s set status=p_status where s.touser_id= to_userid;
-- select * from registration
-- select * from public.propertydetails
-- select * from public.allnotifications
-- select * from public.agentrequestacceptance_notification
-- select n.*,r.name from public.allnotifications as n  join public.registration as r on n.fromuser_id= r.id where n.touser_id=1
end
$BODY$;



CREATE OR REPLACE VIEW public.vw_agentsowner AS
 SELECT oaa.propertyid,
    oaa.agentuserid,
    pd.userid,
    pt.propertytype,
    pd.propertyname,
    pd.price,
    pd.posteddate,
    pd.rentalperiod,
    c.cityname,
    r.name,
    r.mobile,
	pd.status,
	pd.propertyarea
   FROM owneragent oaa
     JOIN propertydetails pd ON oaa.propertyid::text = pd.id::text
     JOIN propertytypes pt ON pd.propertytypeid = pt.id
     JOIN propertyaddress pa ON pd.id::text = pa.propertyid::text
     JOIN city c ON pa.cityid = c.id
     JOIN registration r ON r.id = pd.userid;



CREATE OR REPLACE VIEW public.vw_moreaddress AS
 SELECT pa.propertyid,
    pa.address,
    pa.pincode,
    pa.landmarks,
    pa.latitude,
    pa.longitude,
    cou.countryname,
    cou.currencyname,
    st.statename,
    ci.cityname,
    ar.areaname,
    ar.zipcode,
	pa.areaid
   FROM propertyaddress pa
     LEFT JOIN country cou ON cou.id = pa.countryid
     LEFT JOIN state st ON st.id = pa.stateid
     LEFT JOIN city ci ON ci.id = pa.cityid
     LEFT JOIN area ar ON ar.id = pa.areaid;

ALTER TABLE public.vw_moreaddress
    OWNER TO postgres;


CREATE OR REPLACE VIEW public.vw_moreamenities AS
 SELECT oap.id AS property_id,
    array_to_json(array_agg(pam.propertyamenity)) AS amenities,
    array_agg(pam.id) AS amenities_id,
    array_agg(ppm.amenityvalue) AS amenities_value
   FROM propertydetails oap
     LEFT JOIN addpropertyamenities ppm ON ppm.propertyid = oap.id
     JOIN propertyamenities pam ON pam.id = ppm.propertyamenityid
  GROUP BY oap.id;

ALTER TABLE public.vw_moreamenities
    OWNER TO postgres;

CREATE OR REPLACE VIEW public.view_getrating AS
 SELECT rating.propertyid AS propid,
    trunc(avg(rating.rating), 2) AS trunc
   FROM rating
  GROUP BY rating.propertyid;

ALTER TABLE public.view_getrating
    OWNER TO postgres;

  CREATE OR REPLACE VIEW public.vw_morepropertydetails AS
 SELECT oap.userid,
    oap.id,
    oap.propertyname,
    oap.facing,
    oap.price,
    oap.propertytypeid,
    oap.maintainancecost,
    oap.rentalperiod,
    oap.securitydeposit,
    oap.description,
    oap.nearlukverified,
    oap.status,
    oap.posteddate,
    oap.propertyarea,
    oap.constructionstatus,
    pt.propertytype,
    array_to_json(array_agg(f.facilityname)) AS facilities,
    array_to_json(array_agg(f.id)) AS facilities_id,
    oap.available,
    oap.age,
    oap.preference
   FROM propertydetails oap
     LEFT JOIN propertytypes pt ON oap.propertytypeid = pt.id
     LEFT JOIN addpropertyfacilities ppf ON ppf.propertyid = oap.id
     LEFT JOIN facility f ON f.id = ppf.facilityid
  GROUP BY oap.id, pt.propertytype;

ALTER TABLE public.vw_morepropertydetails
    OWNER TO postgres;


  
CREATE OR REPLACE VIEW public.vw_moredetails AS
 SELECT t1.userid,
    t1.id,
    t1.propertyname,
    t1.facing,
    t1.price,
    t1.propertytypeid,
    t1.maintainancecost,
    t1.rentalperiod,
    t1.securitydeposit,
    t1.description,
    t1.nearlukverified,
    t1.status,
    t1.posteddate,
    t1.propertyarea,
    t1.constructionstatus,
    t1.propertytype,
    t1.facilities,
    t1.facilities_id,
    t2.property_id,
    t2.amenities,
    t2.amenities_id,
    t2.amenities_value,
    t3.propertyid,
    t3.address,
    t3.pincode,
    t3.landmarks,
    t3.latitude,
    t3.longitude,
    t3.countryname,
    t3.currencyname,
    t3.statename,
    t3.cityname,
    t3.areaname,
    t3.zipcode,
    t4.propid,
    t4.trunc,
    t1.available,
    t1.age,
	t3.areaid,
    t1.preference
   FROM ( SELECT vw_morepropertydetails.userid,
            vw_morepropertydetails.id,
            vw_morepropertydetails.propertyname,
            vw_morepropertydetails.facing,
            vw_morepropertydetails.price,
            vw_morepropertydetails.propertytypeid,
            vw_morepropertydetails.maintainancecost,
            vw_morepropertydetails.rentalperiod,
            vw_morepropertydetails.securitydeposit,
            vw_morepropertydetails.description,
            vw_morepropertydetails.nearlukverified,
            vw_morepropertydetails.status,
            vw_morepropertydetails.posteddate,
            vw_morepropertydetails.propertyarea,
            vw_morepropertydetails.constructionstatus,
            vw_morepropertydetails.propertytype,
            vw_morepropertydetails.facilities,
            vw_morepropertydetails.facilities_id,
            vw_morepropertydetails.available,
            vw_morepropertydetails.age,
            vw_morepropertydetails.preference
           FROM vw_morepropertydetails) t1
     LEFT JOIN ( SELECT vw_moreamenities.property_id,
            vw_moreamenities.amenities,
            vw_moreamenities.amenities_id,
            vw_moreamenities.amenities_value
           FROM vw_moreamenities) t2 ON t1.id = t2.property_id
     LEFT JOIN ( SELECT vw_moreaddress.propertyid,
            vw_moreaddress.address,
            vw_moreaddress.pincode,
            vw_moreaddress.landmarks,
            vw_moreaddress.latitude,
            vw_moreaddress.longitude,
            vw_moreaddress.countryname,
            vw_moreaddress.currencyname,
            vw_moreaddress.statename,
            vw_moreaddress.cityname,
            vw_moreaddress.areaname,
            vw_moreaddress.zipcode,
			vw_moreaddress.areaid
           FROM vw_moreaddress) t3 ON t3.propertyid = t1.id
     LEFT JOIN ( SELECT ve.propid,
            ve.trunc
           FROM view_getrating ve) t4 ON t4.propid = t1.id;

ALTER TABLE public.vw_moredetails
    OWNER TO postgres;




CREATE OR REPLACE VIEW public.vw_getfeaturedproperties1 AS
 SELECT pd.propertyname,
    pd.id,
    pd.facing,
    pd.price,
    pd.posteddate,
    pd.nearlukverified,
    pd.rentalperiod,
    pd.preference,
	pd.propertyarea,
    pt.propertytype,
    a.areaname,
    pd.status
   FROM propertydetails pd
     RIGHT JOIN propertytypes pt ON pt.id = pd.propertytypeid
     RIGHT JOIN propertyaddress pa ON pa.propertyid = pd.id
     RIGHT JOIN area a ON a.id = pa.areaid;

ALTER TABLE public.vw_getfeaturedproperties1
    OWNER TO postgres;


CREATE OR REPLACE VIEW public.view_getallproperties AS
 SELECT pd.id AS propertyid,
    pd.propertyname,
    pd.price,
    pd.posteddate,
    pd.rentalperiod,
    pa.latitude,
    pa.longitude,
    a.areaname,
    pt.propertytype,pd.userid
   FROM propertydetails pd
     JOIN propertytypes pt ON pd.propertytypeid = pt.id
     LEFT JOIN propertyaddress pa ON pa.propertyid = pd.id
     LEFT JOIN area a ON pa.areaid = a.id where pd.status='Active';

ALTER TABLE public.view_getallproperties
    OWNER TO postgres;


CREATE OR REPLACE VIEW public.vw_getamenitysbypropertytype AS
 SELECT am.propertytypeid,
    pa.id,
    pa.propertyamenity
   FROM amenitymapping am
     JOIN propertyamenities pa ON pa.id = am.propertyamenityid;

ALTER TABLE public.vw_getamenitysbypropertytype
    OWNER TO postgres;


CREATE OR REPLACE VIEW public.vw_getfacilitiesbypropertytype AS
 SELECT f.id,
    f.facilityname,
    fm.propertytypeid
   FROM facilitymapping fm
     JOIN facility f ON fm.facilityid = f.id;

ALTER TABLE public.vw_getfacilitiesbypropertytype
    OWNER TO postgres;


    CREATE OR REPLACE VIEW public.vw_tenantnotifications AS
 SELECT tenantnotifications.id,
    tenantnotifications.propertyid,
    tenantnotifications.fromuserid,
    tenantnotifications.touserid,
    tenantnotifications.message,
    tenantnotifications.notifydate,
    tenantnotifications.notificationtype,
    tenantnotifications.status
   FROM tenantnotifications;

ALTER TABLE public.vw_tenantnotifications
    OWNER TO postgres;


    CREATE OR REPLACE VIEW public.vw_homefacilities AS
 SELECT oap.userid,
    oap.id,
    array_to_json(array_agg(f.facilityname)) AS facilities,
    array_to_json(array_agg(f.id)) AS facilities_id
   FROM propertydetails oap
     LEFT JOIN propertytypes pt ON oap.propertytypeid = pt.id
     LEFT JOIN addpropertyfacilities ppf ON ppf.propertyid = oap.id
     LEFT JOIN facility f ON f.id = ppf.facilityid
  GROUP BY oap.userid, oap.id;



  CREATE OR REPLACE VIEW public.vw_homeamenities AS
 SELECT oap.id AS aid,
    array_to_json(array_agg(pam.propertyamenity)) AS amenities,
    array_agg(pam.id) AS amenities_id,
    array_agg(ppm.amenityvalue) AS amenities_value
   FROM propertydetails oap
     LEFT JOIN propertytypes pt ON oap.propertytypeid = pt.id
     LEFT JOIN addpropertyamenities ppm ON ppm.propertyid = oap.id
     LEFT JOIN propertyamenities pam ON pam.id = ppm.propertyamenityid
  GROUP BY oap.id, pt.propertytype;


-- CREATE OR REPLACE VIEW public.vw_filterssearch AS
--  SELECT pd.id AS propertyid,
--     pd.userid,
--     pd.propertyname,
--     pd.facing,
--     pd.price,
--     pd.propertytypeid,
--     pd.description,
--     pd.nearlukverified,
--     pd.status,
--     pd.posteddate,
--     pd.propertyarea,
--     pa.cityid,
--     pd.rentalperiod,
--     pa.latitude,
--     pa.longitude,
--     avg(ra.rating) AS rating,
--     ar.areaname,
--     gc.communityname,
--     pt.propertytype
--    FROM propertydetails pd
--      LEFT JOIN propertyaddress pa ON pa.propertyid = pd.id
--      LEFT JOIN rating ra ON ra.id = ra.propertyid
--      LEFT JOIN area ar ON pa.areaid = ar.id
--      LEFT JOIN gatedcommunity gc ON gc.id = pd.communityid
--      LEFT JOIN propertytypes pt ON pt.id = pd.propertytypeid  where pd.status='Active'
--   GROUP BY pd.id, pa.latitude, pa.longitude, ar.areaname, gc.communityname, pt.propertytype, pa.cityid;

-- ALTER TABLE public.vw_filterssearch
--     OWNER TO postgres;


-- CREATE OR REPLACE VIEW public.vw_filterssearch AS
--  SELECT pd.id AS propertyid,
--     pd.userid,
--     pd.propertyname,
--     pd.facing,
--     pd.price,
--     pd.propertytypeid,
--     pd.description,
--     pd.nearlukverified,
--     pd.status,
--     pd.posteddate,
--     pd.propertyarea,
--     pa.cityid,
--     pd.rentalperiod,
--     pa.latitude,
--     pa.longitude,
--     avg(ra.rating) AS rating,
--     ar.areaname,
--     gc.communityname,
--     pt.propertytype
--    FROM propertydetails pd
--      LEFT JOIN propertyaddress pa ON pa.propertyid = pd.id
--      LEFT JOIN rating ra ON ra.id = pa.propertyid
--      LEFT JOIN area ar ON pa.areaid = ar.id
--      LEFT JOIN gatedcommunity gc ON gc.id = pd.communityid
--      LEFT JOIN propertytypes pt ON pt.id = pd.propertytypeid
--   WHERE pd.status::text = 'Active'::text
--   GROUP BY pd.id, pa.latitude, pa.longitude, ar.areaname, gc.communityname, pt.propertytype, pa.cityid;

CREATE OR REPLACE VIEW public.vw_filterssearch AS
 SELECT pd.id AS propertyid,
    pd.userid,
    pd.propertyname,
    pd.facing,
    pd.price,
    pd.propertytypeid,
    pd.description,
    pd.nearlukverified,
    pd.status,
    pd.posteddate,
    pd.propertyarea,
    pa.cityid,
    pd.rentalperiod,
    pa.latitude,
    pa.longitude,
    avg(ra.rating) AS rating,
    ar.areaname,
    gc.communityname,
    pt.propertytype,
	pa.areaid
   FROM propertydetails pd
     LEFT JOIN propertyaddress pa ON pa.propertyid = pd.id
     LEFT JOIN rating ra ON ra.propertyid = pa.propertyid
     LEFT JOIN area ar ON pa.areaid = ar.id
     LEFT JOIN gatedcommunity gc ON gc.id = pd.communityid
     LEFT JOIN propertytypes pt ON pt.id = pd.propertytypeid
  WHERE pd.status::text = 'Active'::text
  GROUP BY pd.id, pa.latitude, pa.longitude, ar.areaname, gc.communityname, pt.propertytype,pa.areaid, pa.cityid;




CREATE OR REPLACE VIEW public.vw_getaminitiesnotselectbyowner AS
 SELECT oap.id,
    pa.id AS amid,
    pa.propertyamenity
   FROM propertydetails oap
     JOIN amenitymapping pam ON oap.propertytypeid = pam.propertytypeid
     JOIN propertyamenities pa ON pa.id = pam.propertyamenityid;

ALTER TABLE public.vw_getaminitiesnotselectbyowner
    OWNER TO postgres;
    

    CREATE OR REPLACE VIEW public.vw_getfacilitiesnotselectbyowner AS
 SELECT oap.id,
    f.facilityname,
    f.id AS fid
   FROM propertydetails oap
     JOIN facilitymapping fm ON oap.propertytypeid = fm.propertytypeid
     JOIN facility f ON f.id = fm.facilityid;

ALTER TABLE public.vw_getfacilitiesnotselectbyowner
    OWNER TO postgres;


CREATE OR REPLACE VIEW public.vw_propertydetailsmap AS
 SELECT pd.id,
    pd.userid,
    pd.propertyname,
    pd.facing,
    pd.price,
    pd.description,
    pd.nearlukverified,
    pd.posteddate,
    pd.propertyarea,
    pd.constructionstatus,
    pd.securitydeposit,
    pd.maintainancecost,
    pd.rentalperiod,
    pd.available,
    pt.propertytype
   FROM propertydetails pd
     JOIN propertyaddress pa ON pa.propertyid = pd.id
     JOIN propertytypes pt ON pd.propertytypeid = pt.id;

ALTER TABLE public.vw_propertydetailsmap
    OWNER TO postgres;

CREATE OR REPLACE VIEW public.vw_mypropertys AS
	SELECT pd.id,
    pt.propertytype,
    pd.propertyname,
    pd.price,
    pd.rentalperiod,
    pd.status,
    pd.posteddate,
    pd.nearlukverified,
    pd.userid,
	pd.propertyarea,
    a.areaname,
    c.cityname
   FROM propertydetails pd
     LEFT JOIN propertyaddress pa ON pa.propertyid = pd.id
     LEFT JOIN area a ON a.id = pa.areaid
     LEFT JOIN city c ON c.id = a.cityid
     LEFT JOIN propertytypes pt ON pt.id = pd.propertytypeid;


CREATE OR REPLACE VIEW public.vw_myfavourates AS
 SELECT pd.id,
    pd.propertyname,
    pd.price,
    pd.rentalperiod,
    pd.userid,
    pt.propertytype,
    pd.status,
    c.cityname
   FROM propertydetails pd
     LEFT JOIN favourites f ON pd.id = f.propertyid
     LEFT JOIN propertytypes pt ON pt.id = pd.propertytypeid
     LEFT JOIN propertyaddress padd ON padd.propertyid = pd.id
     LEFT JOIN city c ON padd.cityid = c.id
  WHERE pd.status::text = 'Active'::text;



 CREATE OR REPLACE VIEW public.vw_homeget AS
 SELECT pd.id,
    pd.userid,
    pd.propertytypeid,
    pd.propertyname,
    pd.facing,
    pd.price,
    pd.nearlukverified,
    pd.status,
    pd.posteddate,
    pd.rentalperiod,
    pd.communityid,
    pa.cityid,
    c.cityname,
    pt.propertytype,
    co.currencyname,
    ar.id AS areaid,
    ar.areaname,
    r.name,
    r.email,
    r.mobile,
    r.occupation,
    c1.cityname AS ownercity
   FROM propertydetails pd
    left JOIN propertyaddress pa ON pd.id = pa.propertyid
    left JOIN city c ON c.id = pa.cityid
    left JOIN propertytypes pt ON pt.id = pd.propertytypeid
    left JOIN country co ON co.id = pa.countryid
    left JOIN area ar ON ar.id = pa.areaid
    left JOIN registration r ON r.id = pd.userid
    left JOIN area a1 ON a1.id = r.areaid
    left JOIN city c1 ON c1.id = a1.cityid
  WHERE pd.status::text = 'Active'::text;

ALTER TABLE public.vw_homeget
    OWNER TO postgres;




CREATE OR REPLACE VIEW public.vw_enquiryform AS
 SELECT en.userid,
    en.propertytypeid,
    en.minprice,
    en.maxprice,
    en.facing,
    co.id AS countryid,
    co.countryname,
    st.statename,
    ct.cityname,
    a.areaname,
    st.id AS stateid,
    ct.id AS cityid,
    a.id AS areaid
   FROM enquiryform en
     LEFT JOIN country co ON en.country = co.id
     LEFT JOIN state st ON en.state = st.id
     LEFT JOIN city ct ON en.city = ct.id
     LEFT JOIN area a ON en.area = a.id;

ALTER TABLE public.vw_enquiryform
    OWNER TO postgres;


   CREATE OR REPLACE VIEW public.vw_getrecommendations AS
 SELECT p.userid,
    p.id AS propertyid,
    p.propertytypeid,
    p.propertyname,
    p.facing,
    p.price,
    p.description,
    p.nearlukverified,
    p.status,
    p.posteddate,
    p.propertyarea,
    p.constructionstatus,
    p.securitydeposit,
    p.maintainancecost,
    p.rentalperiod,
    s.id AS stateid,
    s.statename,
    s.countryid,
    a.id AS areaid,
    a.areaname,
    a.zipcode,
    a.cityid,
    pt.propertytype,
    ci.cityname
   FROM propertydetails p
     JOIN propertytypes pt ON p.propertytypeid = pt.id
     JOIN propertyaddress pa ON p.id::text = pa.propertyid::text
     JOIN country c ON c.id = pa.countryid
     LEFT JOIN state s ON s.id = pa.stateid
     LEFT JOIN city ci ON ci.id = pa.cityid
     LEFT JOIN area a ON a.id = pa.areaid;


ALTER TABLE public.vw_getrecommendations
    OWNER TO postgres; 



CREATE OR REPLACE VIEW public.vw_filterssearchforfeatured AS
 SELECT pd.id AS propertyid,
    pd.userid,
    pd.propertyname,
    pd.facing,
    pd.price,
    pd.propertytypeid,
    pd.description,
    pd.nearlukverified,
    pd.status,
    pd.posteddate,
    pd.propertyarea,
    pa.cityid,
    pd.rentalperiod,
    pa.latitude,
    pa.longitude,
    avg(ra.rating) AS rating,
    ar.areaname,
    gc.communityname,
    pt.propertytype,pd.preference
   FROM propertydetails pd
     LEFT JOIN propertyaddress pa ON pa.propertyid = pd.id
     LEFT JOIN rating ra ON ra.id = ra.propertyid
     LEFT JOIN area ar ON pa.areaid = ar.id
     LEFT JOIN gatedcommunity gc ON gc.id = pd.communityid
     LEFT JOIN propertytypes pt ON pt.id = pd.propertytypeid
  WHERE pd.status::text = 'Active'::text
  GROUP BY pd.id, pa.latitude, pa.longitude, ar.areaname, gc.communityname, pt.propertytype, pa.cityid;

ALTER TABLE public.vw_filterssearch
    OWNER TO postgres;



CREATE OR REPLACE VIEW public.vw_recomendations AS
 SELECT pd.id AS propertyid,
    pd.userid,
    pd.propertyname,
    pd.facing,
    pd.price,
    pd.propertytypeid,
    pd.description,
    pd.nearlukverified,
    pd.status,
    pd.posteddate,
    pd.propertyarea,
    pa.cityid,
    pd.rentalperiod,
    pa.latitude,
    pa.longitude,
    avg(ra.rating) AS rating,
    ar.areaname,
    gc.communityname,
    pt.propertytype,
    pa.countryid,
    pa.stateid,
    pa.areaid
   FROM propertydetails pd
     LEFT JOIN propertyaddress pa ON pa.propertyid = pd.id
     LEFT JOIN rating ra ON ra.id = pa.propertyid
     LEFT JOIN area ar ON pa.areaid = ar.id
     LEFT JOIN gatedcommunity gc ON gc.id = pd.communityid
     LEFT JOIN propertytypes pt ON pt.id = pd.propertytypeid
  WHERE pd.status::text = 'Active'::text
  GROUP BY pa.countryid, pd.id, pa.latitude, pa.longitude, ar.areaname, gc.communityname, pt.propertytype, pa.cityid, pa.stateid, pa.areaid;


CREATE OR REPLACE FUNCTION public.fn_getfacilitiesbypropertytype(
	pt_id integer)
    RETURNS setof vw_getfacilitiesbypropertytype
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query select * from vw_getfacilitiesbypropertytype  where propertytypeid=pt_id;

end

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_getamenitysbypropertytype(
	input bigint)
    RETURNS setof vw_getamenitysbypropertytype
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query SELECT * FROM vw_getamenitysbypropertytype gap where gap.propertytypeid=input;

end

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_property_types_select(
	)
    RETURNS SETOF propertytypes 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query select * from propertytypes;
end

$BODY$;

ALTER FUNCTION public.fn_property_types_select()
    OWNER TO postgres;



CREATE OR REPLACE FUNCTION public.fn_getallcountries(
	)
    RETURNS SETOF country 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query select * from country;
end

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_getallstatesbycountry(
	country_id bigint)
    RETURNS setof state
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query select * from state where countryid=country_id;
end

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_getallcitysbystate(
	state_id bigint)
    RETURNS setof  city
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query select * from city where stateid=state_id;
end

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_getallareasbycity(
	city_id bigint)
    RETURNS setof area
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query select  * from area where cityid=city_id;
end

$BODY$;

CREATE OR REPLACE FUNCTION public.fn_getallproperties(
	)
    RETURNS TABLE(propertyid integer, propertyname character varying, price bigint, posteddate date, rentalperiod character varying, latitude numeric, longitude numeric, areaname character varying, propertytype character varying,userid integer, propid integer, trunc numeric) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query
select vw.*,ve.* from view_Getallproperties vw LEFT JOIN 
view_getrating ve on ve.propid=vw.propertyid;
end


$BODY$;


-- CREATE OR REPLACE FUNCTION public.fn_getmyproperty(
-- 	user_id integer,
-- 	param_limit integer)
--     RETURNS SETOF vw_mypropertys 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin
--  return query
--   select * from vw_mypropertys where userid=user_id and status in('Active','Inactive') ORDER BY posteddate DESC  limit param_limit;
--  end;
 
-- $BODY$;

CREATE OR REPLACE FUNCTION public.fn_getmyproperty1(
	user_id integer,
	param_limit integer)
    RETURNS SETOF vw_mypropertys 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$


begin
 return query
  select * from vw_mypropertys where userid=user_id and status in('Active','Inactive') ORDER BY id DESC  limit param_limit;
 end;
 

$BODY$;

CREATE OR REPLACE FUNCTION public.fn_getmoredetails(
	pid integer,
	sid text DEFAULT NULL::text)
    RETURNS SETOF vw_moredetails 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

DECLARE person_exists integer;
DECLARE user_id integer;
DECLARE property_user_id integer;

begin
if sid is NULL then

return query select * from vw_moredetails where vw_moredetails.id = pid;

else

select userid from userlogin where session = sid into user_id;
select propertyid into person_exists from propertyviews where propertyid = pid and userid = user_id;
select userid into property_user_id from propertydetails where id = pid ;

IF (user_id != property_user_id and person_exists is null) THEN 
 	insert into propertyviews (propertyid, userid, date) values (pid, user_id, now()::date);
END IF;

 
return query select * from vw_moredetails where  vw_moredetails.id = pid;
end if;
end;
$BODY$;




CREATE OR REPLACE FUNCTION public.fn_getmyfavourites(
	user_id integer,
	param_limit integer)
    RETURNS TABLE(id integer, propertyname character varying, price bigint, rentalperiod character varying, propertytype character varying, cityname character varying,propertyarea bigint) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
 return query
 select pd.id,pd.propertyname,pd.price,pd.rentalperiod,pt.propertytype,c.cityname,pd.propertyarea from 
propertydetails pd left join favourites f on pd.id=f.propertyid left join
propertytypes pt on pt.id=pd.propertytypeid left join propertyaddress padd on padd.propertyid=pd.id
left join city c on padd.cityid=c.id where f.userid=user_id and pd.status='Active' limit param_limit;
 end;
 
$BODY$;



CREATE OR REPLACE FUNCTION public.fn_get_biddingprice(
	pid integer)
    RETURNS TABLE(bidid integer, userid integer, propertyid integer, biddingprice bigint, biddingdate date, name character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query select b.bidid,b.userid,b.propertyid,b.biddingprice,b.biddingdate,r.name 
from bidding b join registration r on r.id=b.userid where b.propertyid=pid ;
end

$BODY$;

CREATE OR REPLACE FUNCTION public.fn_tenant_registration_select(
	uid int )
    RETURNS setof registration
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

	begin
	return query SELECT * FROM registration WHERE id =uid;
	end
	
$BODY$;



-- create function fn_getUserprofile(param_session varchar)
-- returns table(id int,username varchar,email varchar,mobile varchar,rolename varchar,
-- 			 address text,gender varchar,occupation varchar,dob varchar) as
-- $$
-- begin
-- return query
-- select 
-- reg.id,reg.name as username,reg.email,reg.mobile,r.name as rolename,
-- reg.address,reg.gender,reg.occupation,reg.dob from registration reg 
-- join userlogin u on reg.id=u.userid
-- join rolemaster r on r.id=reg.roleid where u.userid=
-- (select userid from userlogin where session=param_session);
-- end;
-- $$ language plpgsql;

-- CREATE OR REPLACE FUNCTION public.fn_getuserprofile(
-- 	param_session character varying)
--     RETURNS TABLE(id integer, username character varying, email character varying, mobile character varying, rolename character varying, address text, gender character varying, occupation character varying, dob character varying, stateid integer, cityid integer, areaid integer, discription character varying) 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin
-- return query
-- select 
-- reg.id,reg.name as username,reg.email,reg.mobile,r.name as rolename,
-- reg.address,reg.gender,reg.occupation,reg.dob,a1.cityid as stateid,c.stateid as cityid,reg.areaid,ad.discription from registration reg 
-- left join userlogin u on reg.id=u.userid
-- left join rolemaster r on r.id=reg.roleid
--  left join area a1 on a1.id=reg.areaid
-- left join city c on c.id=a1.cityid
-- left join agentdiscription ad on reg.id=ad.id
-- where u.userid=
-- (select userid from userlogin where session=param_session);

-- end;

-- $BODY$;

-- CREATE OR REPLACE FUNCTION public.fn_getuserprofile(
-- 	param_session character varying)
--     RETURNS TABLE(id integer, username character varying, email character varying, mobile character varying, rolename character varying, address text, gender character varying, occupation character varying, dob character varying, verifymail character varying, stateid integer, cityid integer, areaid integer, discription character varying) 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin
-- return query
-- select 
-- reg.id,reg.name as username,reg.email,reg.mobile,r.name as rolename,
-- reg.address,reg.gender,reg.occupation,reg.dob,reg.verifymail,a1.cityid as stateid,c.stateid as cityid,reg.areaid,ad.discription from registration reg 
-- left join userlogin u on reg.id=u.userid
-- left join rolemaster r on r.id=reg.roleid
--  left join area a1 on a1.id=reg.areaid
-- left join city c on c.id=a1.cityid
-- left join agentdiscription ad on reg.id=ad.id
-- where u.userid=
-- (select userid from userlogin where session=param_session);

-- end;

-- $BODY$;

CREATE OR REPLACE FUNCTION public.fn_getuserprofile1(
param_session character varying)
    RETURNS TABLE(id integer, username character varying, email character varying, mobile character varying, rolename character varying, address text, gender character varying, occupation character varying, dob character varying, verifymail character varying, stateid integer, cityid integer, areaid integer, areaname character varying, cityname character varying, statename character varying, countryname character varying, discription character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query

select 

reg.id,reg.name as username,reg.email,reg.mobile,r.name as rolename,

reg.address,reg.gender,reg.occupation,reg.dob,reg.verifymail,a1.cityid as stateid,

c.stateid as cityid,reg.areaid,a1.areaname,c.cityname,s.statename,co.countryname, ad.discription from registration reg 

left join userlogin u on reg.id=u.userid
left join rolemaster r on r.id=reg.roleid
 left join area a1 on a1.id=reg.areaid
left join city c on c.id=a1.cityid

left join state s on s.id=c.stateid

left join country co on co.id=s.countryid

left join agentdiscription ad on reg.id=ad.id

where u.userid=
(select userid from userlogin where session=param_session);

end;

$BODY$;




CREATE OR REPLACE FUNCTION public.fn_getallcomments(
	property_id integer)
    RETURNS TABLE(id integer, propertyid integer, rating integer, userid integer, comment character varying, name character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
 return query
 select r.id,r.propertyid,r.rating,r.userid,r.comment,reg.name from 
rating r left join registration reg on reg.id=r.userid where r.propertyid=property_id ;
 end;
 $BODY$;


CREATE OR REPLACE FUNCTION public.fn_getcityautofill(
	city_name character varying)
    RETURNS TABLE(usercityname text) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query 
	select (CONCAT(c.cityname,',',s.statename,',',co.countryname)) as cityname from city c join state s on s.id=c.stateid join country co on co.id=s.countryid 
				   where c.cityname ilike '%'||city_name||'%';
				   
				 
end
$BODY$;

CREATE OR REPLACE FUNCTION public.fn_getcityid_bycitandstatename(
	city_name character varying,
	state_name character varying)
    RETURNS TABLE(cityid bigint) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query select c.id from city c left outer join state  s on s.id=c.stateid 
where c.cityname ilike  
'%' ||city_name||'%' and s.statename ilike '%' ||state_name||'%';

end
$BODY$;


-- CREATE OR REPLACE FUNCTION public.fn_filterswithratingpagination(
-- 	ctyid integer,
-- 	ptype integer[],
-- 	fc text[],
-- 	pricemin integer,
-- 	pricemax integer,
-- 	nlvandnv text[],
-- 	page integer,
-- 	rat integer)
--     RETURNS SETOF vw_filterssearch 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin 
-- return query  select * from vw_filterssearch fwr where 
-- fwr.cityid= ctyid  and  fwr.facing = ANY(fc::text[]) and 
-- (fwr.price between pricemin::int and pricemax::int)  
--  and fwr.propertytypeid = ANY(ptype::int[]) and
-- fwr.nearlukverified =ANY(nlvandnv::text[]) and fwr.rating<=rat limit page;
--   end

-- $BODY$;


-- CREATE OR REPLACE FUNCTION public.fn_filterswithratingpagination(
-- 	ctyid integer,
-- 	ptype integer[],
-- 	fc text[],
-- 	pricemin integer,
-- 	pricemax integer,
-- 	nlvandnv text[],
-- 	page integer,
-- 	rat integer,
--     user_id integer)
--     RETURNS table(propertyid integer,userid integer,propertyname character varying,facing character varying,price bigint,propertytypeid integer,description character varying,nearlukverified character varying,status character varying,posteddate date,propertyarea bigint,cityid integer,rentalperiod character varying,latitude numeric,longitude numeric,rating numeric,areaname character varying,communityname character varying,propertytype character varying,userviewd integer,user__id integer) 
--     LANGUAGE 'plpgsql'
--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin 
-- return query  select * from vw_filterssearch fwr left outer join (select (pv.propertyid) as userviewd,pv.userid  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=fwr.propertyid where 
-- fwr.cityid= ctyid  and  fwr.facing = ANY(fc::text[]) and 
-- (fwr.price between pricemin::int and pricemax::int)  
--  and fwr.propertytypeid = ANY(ptype::int[]) and
-- fwr.nearlukverified =ANY(nlvandnv::text[]) and fwr.rating<=rat limit page;
--   end
						 

-- $BODY$;

-- CREATE OR REPLACE FUNCTION public.fn_filterswithratingpagination1(
-- 	ctyid integer,
-- 	ptype integer[],
-- 	fc text[],
-- 	pricemin integer,
-- 	pricemax integer,
-- 	nlvandnv text[],
-- 	page integer,
-- 	rat integer,
-- 	user_id integer)
--     RETURNS TABLE(propertyid integer, userid integer, propertyname character varying, facing character varying, price bigint, propertytypeid integer, description character varying, nearlukverified character varying, status character varying, posteddate date, propertyarea bigint, cityid integer, rentalperiod character varying, latitude numeric, longitude numeric, rating numeric, areaname character varying, communityname character varying, propertytype character varying, userviewd integer, user__id integer) 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin 
-- return query  select * from vw_filterssearch fwr left outer join (select (pv.propertyid) as userviewd,pv.userid  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=fwr.propertyid where 
-- fwr.cityid= ctyid  and  fwr.facing = ANY(fc::text[]) and 
-- (fwr.price between pricemin::int and pricemax::int)  
--  and fwr.propertytypeid = ANY(ptype::int[]) and
-- fwr.nearlukverified =ANY(nlvandnv::text[]) and fwr.rating<=rat order by propertyid desc limit page;
--   end
						 

-- $BODY$;

CREATE OR REPLACE FUNCTION public.fn_filterswithratingpagination1(
ctyid integer,
ptype integer[],
fc text[],
pricemin integer,
pricemax integer,
nlvandnv text[],
page integer,
rat integer,
user_id integer)
    RETURNS TABLE(propertyid integer, userid integer, propertyname character varying, facing character varying, price bigint, propertytypeid integer, description character varying, nearlukverified character varying, status character varying, posteddate date, propertyarea bigint, cityid integer, rentalperiod character varying, latitude numeric, longitude numeric, rating numeric, areaname character varying, communityname character varying, propertytype character varying, userviewd integer, user__id integer, contactviewed character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query  select * from vw_filterssearch fwr left outer join (select (pv.propertyid) as userviewd,pv.userid,pv.contactviewed  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=fwr.propertyid where 
fwr.cityid= ctyid  and  fwr.facing = ANY(fc::text[]) and 
(fwr.price between pricemin::int and pricemax::int)  
 and fwr.propertytypeid = ANY(ptype::int[]) and
fwr.nearlukverified =ANY(nlvandnv::text[]) and fwr.rating<=rat order by propertyid desc limit page;
  end


$BODY$;


CREATE OR REPLACE FUNCTION public.fn_filterswithratingpaginationnew(
	ctyid integer,
	ptype integer[],
	fc text[],
	pricemin integer,
	pricemax integer,
	nlvandnv text[],
	page integer,
	rat integer,
	user_id integer,
	off_set integer)
    RETURNS TABLE(propertyid integer, userid integer, propertyname character varying, facing character varying, price bigint, propertytypeid integer, description character varying, nearlukverified character varying, status character varying, posteddate date, propertyarea bigint, cityid integer, rentalperiod character varying, latitude numeric, longitude numeric, rating numeric, areaname character varying, communityname character varying, propertytype character varying, userviewd integer, user__id integer,contactviewed character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query  select * from vw_filterssearch fwr left outer join (select (pv.propertyid) as userviewd,pv.userid,pv.contactviewed  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=fwr.propertyid where 
fwr.cityid= ctyid  and  fwr.facing = ANY(fc::text[]) and 
(fwr.price between pricemin::int and pricemax::int)  
 and fwr.propertytypeid = ANY(ptype::int[]) and
fwr.nearlukverified =ANY(nlvandnv::text[]) and fwr.rating<=rat order by fwr.propertyid desc limit page offset off_set; 
  end
						 

$BODY$;



-- CREATE OR REPLACE FUNCTION public.fn_filterswithratingpaginationnew(
-- 	ctyid integer,
-- 	ptype integer[],
-- 	fc text[],
-- 	pricemin integer,
-- 	pricemax integer,
-- 	nlvandnv text[],
-- 	page integer,
-- 	rat integer,
-- 	user_id integer,
-- 	off_set integer)
--     RETURNS TABLE(propertyid integer, userid integer, propertyname character varying, facing character varying, price bigint, propertytypeid integer, description character varying, nearlukverified character varying, status character varying, posteddate date, propertyarea bigint, cityid integer, rentalperiod character varying, latitude numeric, longitude numeric, rating numeric, areaname character varying, communityname character varying, propertytype character varying, userviewd integer, user__id integer) 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin 
-- return query  select * from vw_filterssearch fwr left outer join (select (pv.propertyid) as userviewd,pv.userid  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=fwr.propertyid where 
-- fwr.cityid= ctyid  and  fwr.facing = ANY(fc::text[]) and 
-- (fwr.price between pricemin::int and pricemax::int)  
--  and fwr.propertytypeid = ANY(ptype::int[]) and
-- fwr.nearlukverified =ANY(nlvandnv::text[]) and fwr.rating<=rat order by fwr.propertyid desc limit page offset off_set; 
--   end
						 

-- $BODY$;





-- CREATE OR REPLACE FUNCTION public.fn_filterswithoutratingpagination(
-- 	ctyid integer,
-- 	ptype integer[],
-- 	fc text[],
-- 	pricemin integer,
-- 	pricemax integer,
-- 	nlvandnv text[],
-- 	page integer)
--     RETURNS SETOF vw_filterssearch 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin 
-- return query  select * from vw_filterssearch fwr where 
-- fwr.cityid= ctyid  and  fwr.facing = ANY(fc::text[]) and 
-- (fwr.price between pricemin::int and pricemax::int)  
--  and fwr.propertytypeid = ANY(ptype::int[]) and
-- fwr.nearlukverified =ANY(nlvandnv::text[]) limit page;

--   end

-- $BODY$;


-- CREATE OR REPLACE FUNCTION public.fn_filterswithoutratingpagination(
-- 	ctyid integer,
-- 	ptype integer[],
-- 	fc text[],
-- 	pricemin integer,
-- 	pricemax integer,
-- 	nlvandnv text[],
-- 	page integer,
-- user_id integer)
--     RETURNS table(propertyid integer,userid integer,propertyname character varying,facing character varying,price bigint,propertytypeid integer,description character varying,nearlukverified character varying,status character varying,posteddate date,propertyarea bigint,cityid integer,rentalperiod character varying,latitude numeric,longitude numeric,rating numeric,areaname character varying,communityname character varying,propertytype character varying,userviewd integer,user__id integer) 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin 
-- return query  select * from vw_filterssearch fwr  left outer join (select (pv.propertyid) as userviewd,pv.userid  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=fwr.propertyid where 
-- fwr.cityid= ctyid  and  fwr.facing = ANY(fc::text[]) and 
-- (fwr.price between pricemin::int and pricemax::int)  
--  and fwr.propertytypeid = ANY(ptype::int[]) and
-- fwr.nearlukverified =ANY(nlvandnv::text[]) limit page;

--   end

-- $BODY$;

-- CREATE OR REPLACE FUNCTION public.fn_filterswithoutratingpagination1(
-- 	ctyid integer,
-- 	ptype integer[],
-- 	fc text[],
-- 	pricemin integer,
-- 	pricemax integer,
-- 	nlvandnv text[],
-- 	page integer,
-- 	user_id integer)
--     RETURNS TABLE(propertyid integer, userid integer, propertyname character varying, facing character varying, price bigint, propertytypeid integer, description character varying, nearlukverified character varying, status character varying, posteddate date, propertyarea bigint, cityid integer, rentalperiod character varying, latitude numeric, longitude numeric, rating numeric, areaname character varying, communityname character varying, propertytype character varying, userviewd integer, user__id integer) 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin 
-- return query  select * from vw_filterssearch fwr  left outer join (select (pv.propertyid) as userviewd,pv.userid  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=fwr.propertyid where 
-- fwr.cityid= ctyid  and  fwr.facing = ANY(fc::text[]) and 
-- (fwr.price between pricemin::int and pricemax::int)  
--  and fwr.propertytypeid = ANY(ptype::int[]) and
-- fwr.nearlukverified =ANY(nlvandnv::text[]) order by propertyid desc limit page;

--   end

-- $BODY$;


CREATE OR REPLACE FUNCTION public.fn_filterswithoutratingpagination1(
ctyid integer,
ptype integer[],
fc text[],
pricemin integer,
pricemax integer,
nlvandnv text[],
page integer,
user_id integer)
    RETURNS TABLE(propertyid integer, userid integer, propertyname character varying, facing character varying, price bigint, propertytypeid integer, description character varying, nearlukverified character varying, status character varying, posteddate date, propertyarea bigint, cityid integer, rentalperiod character varying, latitude numeric, longitude numeric, rating numeric, areaname character varying, communityname character varying, propertytype character varying, userviewd integer, user__id integer, contactviewed character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query  select * from vw_filterssearch fwr  left outer join (select (pv.propertyid) as userviewd,pv.userid,pv.contactviewed from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=fwr.propertyid where 
fwr.cityid= ctyid  and  fwr.facing = ANY(fc::text[]) and 
(fwr.price between pricemin::int and pricemax::int)  
 and fwr.propertytypeid = ANY(ptype::int[]) and
fwr.nearlukverified =ANY(nlvandnv::text[]) order by propertyid desc limit page;

  end

$BODY$;




-- CREATE OR REPLACE FUNCTION public.fn_filterswithoutratingpaginationnew(
-- 	ctyid integer,
-- 	ptype integer[],
-- 	fc text[],
-- 	pricemin integer,
-- 	pricemax integer,
-- 	nlvandnv text[],
-- 	page integer,
-- 	user_id integer,
-- 	off_set integer)
--     RETURNS TABLE(propertyid integer, userid integer, propertyname character varying, facing character varying, price bigint, propertytypeid integer, description character varying, nearlukverified character varying, status character varying, posteddate date, propertyarea bigint, cityid integer, rentalperiod character varying, latitude numeric, longitude numeric, rating numeric, areaname character varying, communityname character varying, propertytype character varying, userviewd integer, user__id integer) 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin 
-- return query  select * from vw_filterssearch fwr  left outer join (select (pv.propertyid) as userviewd,pv.userid  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=fwr.propertyid where 
-- fwr.cityid= ctyid  and  fwr.facing = ANY(fc::text[]) and 
-- (fwr.price between pricemin::int and pricemax::int)  
--  and fwr.propertytypeid = ANY(ptype::int[]) and
-- fwr.nearlukverified =ANY(nlvandnv::text[])  order by fwr.propertyid desc limit page offset off_set;

--   end

-- $BODY$;



CREATE OR REPLACE FUNCTION public.fn_filterswithoutratingpaginationnew(
	ctyid integer,
	ptype integer[],
	fc text[],
	pricemin integer,
	pricemax integer,
	nlvandnv text[],
	page integer,
	user_id integer,
	off_set integer)
    RETURNS TABLE(propertyid integer, userid integer, propertyname character varying, facing character varying, price bigint, propertytypeid integer, description character varying, nearlukverified character varying, status character varying, posteddate date, propertyarea bigint, cityid integer, rentalperiod character varying, latitude numeric, longitude numeric, rating numeric, areaname character varying, communityname character varying, propertytype character varying, area_id integer, userviewd integer, user__id integer,contactviewed character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query  select * from vw_filterssearch fwr  left outer join (select (pv.propertyid) as userviewd,pv.userid,pv.contactviewed  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=fwr.propertyid where 
fwr.cityid= ctyid  and  fwr.facing = ANY(fc::text[]) and 
(fwr.price between pricemin::int and pricemax::int)  
 and fwr.propertytypeid = ANY(ptype::int[]) and
fwr.nearlukverified =ANY(nlvandnv::text[])  order by fwr.propertyid desc limit page offset off_set;

  end

$BODY$;


-- CREATE OR REPLACE FUNCTION public.fn_getownersinfo_byproperty(
-- 	pid int )
--     RETURNS TABLE(id int, name character varying,mobile character varying,email character varying,price bigint) 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin 
-- return query select r.id,r.name,r.mobile,r.email,p.price from registration r join propertydetails p on p.userid=r.id where p.id=pid;
-- end
-- $BODY$;

CREATE OR REPLACE FUNCTION public.fn_getownersinfo_byproperty1(
	pid integer)
    RETURNS TABLE(id integer, name character varying, mobile character varying, email character varying, verifymail character varying, price bigint) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$


begin 
return query select r.id,r.name,r.mobile,r.email,r.verifymail,p.price from registration r join propertydetails p on p.userid=r.id where p.id=pid;
end

$BODY$;



-- agent

CREATE OR REPLACE FUNCTION public.fn_getmyowners(
	uname integer,
	page integer)
    RETURNS SETOF vw_agentsowner 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
	return query select * from vw_agentsowner where agentuserid=uname and status='Active' limit page;
end
$BODY$;

ALTER FUNCTION public.fn_getmyowners(integer, integer)
    OWNER TO postgres;

CREATE OR REPLACE FUNCTION public.fn_propertybyareaorcity(
	cit character varying,
	areanamee character varying)
    RETURNS TABLE(countproperty bigint, propertytypename character varying, propertytypeid integer) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

declare ci integer;

declare areas integer;
begin
  select a.id into areas from propertydetails pd  left join propertyaddress pa on
pd.id=pa.propertyid left join area a on pa.areaid=a.id left
join propertytypes pt on  pt.id=pd.propertytypeid where pd.status='Active' and a.areaname ilike '%' ||  areanamee ||'%';

  IF areas is  null THEN
return query select count(pd.propertytypeid)as count,pt.propertytype,pd.propertytypeid from propertydetails pd  left join propertyaddress pa on
pd.id=pa.propertyid left join city a on pa.cityid=a.id left
join propertytypes pt on  pt.id=pd.propertytypeid where pd.status='Active' and a.cityname ilike '%'|| cit ||'%' group by pt.propertytype,pd.propertytypeid ;
else
 return query select count(pd.propertytypeid)as count_city,pt.propertytype,pd.propertytypeid from propertydetails pd  left join propertyaddress pa on
pd.id=pa.propertyid left join area a on pa.areaid=a.id left
join propertytypes pt on  pt.id=pd.propertytypeid where pd.status='Active' and a.areaname ilike '%' || areanamee ||'%' group by pt.propertytype,pd.propertytypeid ;

END IF;  
end

$BODY$;



CREATE OR REPLACE FUNCTION public.fn_getfacilitiesnotselectbyowner(
	prid integer)
    RETURNS SETOF vw_getfacilitiesnotselectbyowner 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query select * from vw_getfacilitiesnotselectbyowner 
where id=prid and fid not in (select facilityid from addpropertyfacilities where propertyid=prid)	;
end
$BODY$;



CREATE OR REPLACE FUNCTION public.fn_getaminitiesnotselectbyowner(
	pid integer)
    RETURNS SETOF vw_getaminitiesnotselectbyowner 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
	return query select id,amid , propertyamenity from vw_getAminitiesnotselectbyowner
	where id = pid  and amid not in (select propertyamenityid from addpropertyamenities where propertyid=pid);
end
$BODY$;


CREATE OR REPLACE FUNCTION public.fn_propertydetailsmap(
	property_id integer)
    RETURNS SETOF vw_propertydetailsmap 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query select * from vw_propertydetailsmap where id=property_id;
end

$BODY$;

ALTER FUNCTION public.fn_propertydetailsmap(integer)
    OWNER TO postgres;


    CREATE OR REPLACE FUNCTION public.fn_checkuserregisted(
	e_mail character varying)
    RETURNS TABLE(uid integer, mail character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query select id,email from Registration where email=e_mail;
end

$BODY$;



CREATE OR REPLACE FUNCTION public.fn_getfav(
	uid integer,
	pid integer)
    RETURNS TABLE(id integer,userid integer, propertyid integer) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query
select * from favourites fa where fa.userid=uid and fa.propertyid=pid;
end;
$BODY$;

-- CREATE OR REPLACE FUNCTION public.fn_get_property_views(
-- 	param_pid integer)
--     RETURNS TABLE(propertyid integer, userid integer, date character varying, name character varying, email character varying, mobile character varying) 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin

-- return query 
-- select p.propertyid, p.userid, p.date, r.name, r.email, r.mobile from propertyviews as p
-- 	left join registration as r on r.id = p.userid
-- 	where p.propertyid = param_pid;
 
-- end;
-- $BODY$;

-- ALTER FUNCTION public.fn_get_property_views(integer)
--     OWNER TO postgres;

CREATE OR REPLACE FUNCTION public.fn_get_property_views1(
	param_pid integer)
    RETURNS TABLE(propertyid integer, userid integer, date character varying, name character varying, email character varying, mobile character varying, verifymail character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin

return query 
select p.propertyid, p.userid, p.date, r.name, r.email, r.mobile, r.verifymail from propertyviews as p
	left join registration as r on r.id = p.userid
	where p.propertyid = param_pid;
 
end;

$BODY$;



    CREATE OR REPLACE FUNCTION public.fn_get_homeget(
	pt1 integer,
	pt2 integer,
	pt3 integer,
	pt4 integer,
	pt5 integer,
	pt6 integer,
	city_id integer,
	p_limit integer)
    RETURNS SETOF vw_homeget 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin

IF city_id is not null then
return query (select * from vw_homeget vhg where vhg.propertytypeid=pt1 and vhg.cityid=city_id  order by  vhg.id desc limit p_limit) union (select * from vw_homeget vhg where vhg.propertytypeid=pt2 and vhg.cityid=city_id  order by  vhg.id desc limit p_limit) union (select * from vw_homeget vhg where vhg.propertytypeid=pt3 and vhg.cityid=city_id  order by  vhg.id desc limit p_limit) union (select * from vw_homeget vhg where vhg.propertytypeid=pt4 and vhg.cityid=city_id  order by  vhg.id desc limit p_limit) union (select * from vw_homeget vhg where vhg.propertytypeid=pt5 and vhg.cityid=city_id order by  vhg.id desc limit p_limit) union (select * from vw_homeget vhg where vhg.propertytypeid=pt6 and vhg.cityid=city_id order by  vhg.id desc limit p_limit); 
END IF;
IF city_id is  null then
return query (select * from vw_homeget vhg where vhg.propertytypeid=pt1   order by  vhg.id desc limit p_limit) union (select * from vw_homeget vhg where vhg.propertytypeid=pt2   order by  vhg.id desc limit p_limit) union (select * from vw_homeget vhg where vhg.propertytypeid=pt3   order by  vhg.id desc limit p_limit) union (select * from vw_homeget vhg where vhg.propertytypeid=pt4   order by  vhg.id desc limit p_limit) union (select * from vw_homeget vhg where vhg.propertytypeid=pt5  order by  vhg.id desc limit p_limit) union (select * from vw_homeget vhg where vhg.propertytypeid=pt6   order by  vhg.id desc limit p_limit) ;
 end if;
end

$BODY$;

ALTER FUNCTION public.fn_get_homeget(integer, integer, integer, integer, integer, integer, integer, integer)
    OWNER TO postgres;





    CREATE OR REPLACE FUNCTION public.fn_tenantnotificationsselect(
	param_propertyid integer,
	param_userid integer,
    param_notificationtype character varying)
    RETURNS setof vw_tenantnotifications
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query

select *from vw_tenantnotifications
where propertyid=param_propertyid and fromuserid=param_userid and notificationtype=param_notificationtype;
end;
$BODY$;







CREATE OR REPLACE FUNCTION public.fn_getpropertytypeidbyname(
	input character varying)
    RETURNS SETOF propertytypes 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query  select * from propertytypes where propertytype ilike '%'||input||'%';

end

$BODY$;



CREATE OR REPLACE FUNCTION public.fn_getpropertyautofill(
	property character varying)
    RETURNS TABLE(propertyname character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin  
return query select c.propertytype from propertytypes c where c.propertytype ilike '%'||property||'%';
end
$BODY$;

CREATE OR REPLACE FUNCTION public.fn_getcitycountries(
	)
    RETURNS TABLE(cityid bigint, cityname character varying, count bigint) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query 
		select c.id,c.cityname,count(pa.cityid) from city c
left join propertyaddress pa on c.id=pa.cityid left join propertydetails pd on pa.propertyid = pd.id
where pd.status='Active' and c.id in(200544,200513,200249,200355,200417,200657,200372,200014)
group by c.id,c.cityname ORDER BY c.cityname in('Hyderabad ') desc;
end;
$BODY$;



CREATE OR REPLACE VIEW public.vw_getbycity AS
 SELECT c.cityname,
    a.areaname,
    pa.address,
    pa.pincode,
    pa.latitude,
    pa.longitude,
    pa.cityid,
    pd.id,
    pd.userid,
    pd.propertytypeid,
    pd.propertyname,
    pd.facing,
    pd.price,
    pd.description,
    pd.nearlukverified,
    pd.status,
    pd.posteddate,
    pd.propertyarea,
    pd.constructionstatus,
    pd.securitydeposit,
    pd.maintainancecost,
    pd.rentalperiod,
    pd.communityid,
    pt.propertytype
   FROM propertydetails pd
     JOIN propertyaddress pa ON pd.id = pa.propertyid
     JOIN propertytypes pt ON pt.id = pd.propertytypeid
     JOIN country co ON pa.countryid = co.id
     JOIN state s ON pa.stateid = s.id
     JOIN city c ON pa.cityid = c.id
     JOIN area a ON pa.areaid = a.id;



-- CREATE OR REPLACE VIEW public.vw_getrecentpropertyview AS
--  SELECT d.posteddate,
--     a.areaid,
--     d.price,
--     a.stateid,
--     a.cityid,
--     d.propertyname,
--     t.propertytype,
--     r.areaname,
--     c.cityname,
--     a.propertyid,
--     d.rentalperiod,
--     d.status,
--     pv.userid
--    FROM propertyaddress a
--      JOIN propertydetails d ON a.propertyid = d.id
--      JOIN propertytypes t ON t.id = d.propertytypeid
--      JOIN area r ON a.areaid = r.id
--      JOIN city c ON a.cityid = c.id
--      JOIN propertyviews pv ON pv.propertyid = d.id;

-- ALTER TABLE public.vw_getrecentpropertyview
--     OWNER TO postgres;


CREATE OR REPLACE VIEW public.vw_getrecentpropertyview AS
 SELECT d.posteddate,
    a.areaid,
    d.price,
    a.stateid,
    a.cityid,
    d.propertyname,
    t.propertytype,
    r.areaname,
    c.cityname,
    a.propertyid,
    d.rentalperiod,
    d.status,
    pv.userid,
    pv.contactviewed,
    d.propertyarea
   FROM propertyaddress a
     JOIN propertydetails d ON a.propertyid = d.id
     JOIN propertytypes t ON t.id = d.propertytypeid
     JOIN area r ON a.areaid = r.id
     JOIN city c ON a.cityid = c.id
     JOIN propertyviews pv ON pv.propertyid = d.id;


CREATE OR REPLACE VIEW public.vw_getallfeartued AS
 SELECT pd.id,
    pd.userid,
    pd.propertyname,
    pd.facing,
    pd.price,
    pd.nearlukverified,
    pd.status,
    pd.posteddate,
    pd.preference,
    a.areaname,
    pt.propertytype,
    pd.rentalperiod
   FROM propertydetails pd
     JOIN propertyaddress pa ON pd.id = pa.propertyid
     JOIN area a ON pa.areaid = a.id
     JOIN propertytypes pt ON pt.id = pd.propertytypeid;



CREATE OR REPLACE FUNCTION public.fn_getbycity(
	param_cityid integer,
	page integer)
    RETURNS SETOF vw_getbycity 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query 
select * from vw_getbycity where status='Active' 
and cityid=param_cityid order by id desc  limit page;

end
$BODY$;

ALTER FUNCTION public.fn_getbycity(integer, integer)
    OWNER TO postgres;


CREATE OR REPLACE FUNCTION public.fn_addagentdiscription(
	param_id integer,
	param_discription character varying)
    RETURNS character varying
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
declare n int;
 begin
if not exists(select * from agentdiscription  where id = param_id) then
 insert into agentdiscription (id,discription) values(param_id,param_discription) returning id into n;
  return n;
 return 'inserted successfully';
 
 else
    update agentdiscription set discription=param_discription where id=param_id;
																	
  return 'updated successfully';
 end if;
 end
 $BODY$;



CREATE OR REPLACE VIEW public.vw_getpropertydetailsbycityid AS
 SELECT d.posteddate,
    a.areaid,
    d.price,
    a.stateid,
    a.cityid,
    d.propertyname,
    t.propertytype,
    r.areaname,
    c.cityname,
    a.propertyid,
    d.rentalperiod,
	d.status
   FROM propertyaddress a
     JOIN propertydetails d ON a.propertyid = d.id
     JOIN propertytypes t ON t.id = d.propertytypeid
     JOIN area r ON a.areaid = r.id
     JOIN city c ON a.cityid = c.id;


-- CREATE OR REPLACE FUNCTION public.fn_getpropertynamebycityid(
-- 	citiesid bigint,
-- 	properttype character varying,
-- page int)
--     RETURNS SETOF vw_getpropertydetailsbycityid 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$
-- begin
-- return query
-- select * from vw_getPropertydetailsByCityId a where a.cityid = citiesid and a.propertytype ilike '%'||properttype||'%' and a.status='Active' limit page;
-- end 
-- $BODY$;

CREATE OR REPLACE FUNCTION public.fn_getpropertynamebycityid1(
	citiesid bigint,
	properttype character varying,
	page integer)
    RETURNS SETOF vw_getpropertydetailsbycityid 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query
select * from vw_getPropertydetailsByCityId a where a.cityid = citiesid and a.propertytype 
ilike '%'||properttype||'%' and a.status='Active' order by propertyid desc limit page;
end 

$BODY$;



-- CREATE OR REPLACE FUNCTION public.fn_viewallwithoutlocationuserid(
-- 	properttype character varying,
-- 	user_id integer,
-- 	page integer)
--     RETURNS TABLE(posteddate date, areaid integer, price bigint, stateid integer, cityid integer, propertyname character varying, propertytype character varying, areaname character varying, cityname character varying, propertyid integer, rentalperiod character varying, status character varying, userviewd integer, user__id integer) 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$
-- begin
-- return query
-- select * from vw_getPropertydetailsByCityId a left outer join (select (pv.propertyid) as userviewd,pv.userid  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=a.propertyid
-- where a.propertytype ilike '%'||properttype||'%' and a.status='Active' order by propertyid desc limit page ;
-- end 
-- $BODY$;

CREATE OR REPLACE FUNCTION public.fn_viewallwithoutlocationuserid(
	properttype character varying,
	user_id integer,
	page integer)
    RETURNS TABLE(posteddate date, areaid integer, price bigint, stateid integer, cityid integer, propertyname character varying, propertytype character varying, areaname character varying, cityname character varying, propertyid integer, rentalperiod character varying, status character varying, userviewd integer, user__id integer, contactviewed character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query
select * from vw_getPropertydetailsByCityId a left outer join (select (pv.propertyid) as userviewd,pv.userid ,pv.contactviewed  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=a.propertyid
where a.propertytype ilike '%'||properttype||'%' and a.status='Active' order by propertyid desc limit page ;
end 
$BODY$;



CREATE OR REPLACE FUNCTION public.fn_getcityid(
	property_type character varying,
	state_name character varying,
	city_name character varying)
    RETURNS TABLE(city_id bigint) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query
select c.id from city c join state s on c.stateid=s.id where c.cityname ilike '%'||city_name||'%' and s.statename ilike '%'||state_name||'%' ;
end
$BODY$;











CREATE OR REPLACE FUNCTION public.fn_getenquiryform(
	user_id integer)
    RETURNS SETOF vw_enquiryform 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query select * from vw_enquiryform where userid=user_id;
end

$BODY$;

ALTER FUNCTION public.fn_getenquiryform(integer)
    OWNER TO postgres;


-- CREATE OR REPLACE FUNCTION public.fn_getrecommendation(
-- 	country_id bigint)
--     RETURNS SETOF vw_getrecommendations 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin 
-- return query select * from vw_getrecommendations  where countryid=country_id and status= 'Active';
-- end

-- $BODY$;

CREATE OR REPLACE FUNCTION public.fn_getrecommendation(
	country_id bigint,
user_id integer)
    RETURNS table(userid integer,propertyid integer,propertytypeid integer,propertyname character varying,facing character varying,price bigint,description character varying,nearlukverified character varying,status character varying,posteddate date,propertyarea bigint,constructionstatus character varying,securitydeposit bigint,maintainancecost bigint,rentalperiod character varying,stateid integer,statename character varying,countryid integer,areaid bigint,areaname character varying,zipcode character varying,cityid integer,propertytype character varying,cityname varchar,userviewd integer,user__id integer)
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query select * from vw_getrecommendations rec left outer join (select (pv.propertyid) as userviewd,pv.userid  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=rec.propertyid 
where rec.countryid=country_id and rec.status= 'Active';
end

$BODY$;




-- Admin

CREATE OR REPLACE VIEW public.vw_adminhome AS
 SELECT p.id,
    p.propertyname,
    co.countryname,
    c.cityname,
    p.nearlukverified,
    s.mobile,
    p.status,
    st.statename,
    a.areaname,
    pa.countryid,
    pa.stateid,
    pa.cityid,
    pa.areaid
   FROM propertydetails p
     LEFT JOIN propertytypes pt ON p.propertytypeid = pt.id
     LEFT JOIN propertyaddress pa ON pa.propertyid::text = p.id::text
     LEFT JOIN country co ON pa.countryid = co.id
     LEFT JOIN city c ON pa.cityid = c.id
     LEFT JOIN registration s ON p.userid::text = s.id::text
     LEFT JOIN state st ON pa.stateid = st.id
     LEFT JOIN area a ON pa.areaid = a.id
  GROUP BY p.id, c.id, c.cityname, pt.id, pt.propertytype, co.id, co.countryname, s.mobile, st.statename, a.areaname, pa.countryid, pa.stateid, pa.cityid, pa.areaid;



CREATE OR REPLACE FUNCTION public.fn_adminhome(
	page integer)
    RETURNS SETOF vw_adminhome 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query select * from vw_adminhome order by id desc limit page;
end
$BODY$;





CREATE OR REPLACE FUNCTION public.fn_adminnearlukverifiednotverified(
	param_nearlukverified character varying,
	country_id bigint,
	state_id bigint,
	city_id bigint,
	area_id bigint)
    RETURNS SETOF vw_adminhome 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query select * from vw_adminhome where nearlukverified=param_nearlukverified and countryid=country_id and stateid=state_id and cityid=city_id and areaid=area_id ;
end
$BODY$;





CREATE OR REPLACE FUNCTION public.fn_adminnearlukactiveinactive(
	param_status character varying,
	country_id bigint,
	state_id bigint,
	city_id bigint,
	area_id bigint)
    RETURNS SETOF vw_adminhome 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query select * from vw_adminhome where status=param_status and countryid=country_id and stateid=state_id and cityid=city_id and areaid=area_id ;
end
$BODY$;


CREATE OR REPLACE FUNCTION public.fn_admincontactus(
	)
    RETURNS SETOF contactus 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query select *from contactus;
end
$BODY$;




CREATE OR REPLACE FUNCTION public.fn_getcountrymapforpost(
	country_name character varying)
    RETURNS TABLE(countryid integer) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query 
	select  id from country where  TRIM(BOTH FROM  LOWER(countryname)) =LOWER(country_name);
				   
				 
end
$BODY$;



CREATE OR REPLACE FUNCTION public.fn_getstatemapforpost(
	state_name character varying,
	country_id integer)
    RETURNS TABLE(stateid integer) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query 
select  s.id from state s join country c on c.id=s.countryid where TRIM(BOTH FROM  LOWER(statename)) =LOWER(state_name) and c.id=country_id;				   
				 
end
$BODY$;



CREATE OR REPLACE FUNCTION public.fn_getcitymapforpost(
	city_name character varying,
	state_id integer)
    RETURNS TABLE(cityid bigint) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query 

	select  c.id from city c join state s on s.id=c.stateid where TRIM(BOTH FROM  LOWER(cityname)) =LOWER(city_name) and s.id=state_id;
				   
				 
end
$BODY$;



CREATE OR REPLACE FUNCTION public.fn_getareamapforpost(
	area_name character varying,
	city_id integer)
    RETURNS TABLE(areaid bigint) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query 
	select  a.id from area a join city c on c.id=a.cityid where   TRIM(BOTH FROM  LOWER(areaname)) =LOWER(area_name) and c.id=city_id;
				   
				 
end
$BODY$;




CREATE OR REPLACE FUNCTION public.fn_getagentsownernotificationbyusername(
	to_userid integer)
    RETURNS SETOF vw_notificationsgetbyusername 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin 
return query select * from vw_notificationsgetbyusername where status='unseen' and  touserid=to_userid;
end
$BODY$;

CREATE OR REPLACE FUNCTION public.fn_getagentsownernotificationbyusername_count(
	to_userid integer)
    RETURNS SETOF vw_notificationsgetbyusername 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin 
return query select * from vw_notificationsgetbyusername where status='unseen' and notificationtype='request' and  touserid=to_userid;
end
$BODY$;

ALTER FUNCTION public.fn_getagentsownernotificationbyusername_count(integer)
    OWNER TO postgres;


    CREATE OR REPLACE FUNCTION public.fn_owner_add_agent_select(
	property_id integer,
	agent_userid integer)
    RETURNS TABLE(a_id integer, a_propertyid integer, a_agentuserid integer, a_status character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query select * from owneragent where  propertyid=property_id and agentuserid=agent_userid;
end
$BODY$;

ALTER FUNCTION public.fn_owner_add_agent_select(integer, integer)
    OWNER TO postgres;


CREATE OR REPLACE FUNCTION public.fn_getfeaturedproperties(
featured_name character varying,
page integer)
    RETURNS SETOF vw_getfeaturedproperties1 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query 

select * from vw_GetFeaturedProperties1 pd   where  pd.preference ilike '%'||Featured_name||'%' and pd.status='Active' limit page;

end

$BODY$;


-- CREATE OR REPLACE FUNCTION public.fn_getfeaturedpropertiesbyuserid(
-- 	featured_name character varying,
-- 	user_id integer,
-- 	page integer)
--     RETURNS TABLE(propertyname character varying, id integer, facing character varying, price bigint, posteddate date, nearlukverified character varying, rentalperiod character varying, perference character varying, propertytype character varying, areaname character varying, status character varying, userviewd integer, user__id integer) 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin
-- return query 

-- select * from vw_GetFeaturedProperties1 pd  left outer join (select (pv.propertyid) as userviewd,pv.userid  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=pd.id   where  pd.preference ilike '%'||Featured_name||'%' and pd.status='Active' limit page;

-- end

-- $BODY$;


-- CREATE OR REPLACE FUNCTION public.fn_getfeaturedpropertiesbyuserid(
-- 	featured_name character varying,
-- 	user_id integer,
-- 	page integer)
--     RETURNS TABLE(propertyname character varying, id integer, facing character varying, price bigint, posteddate date, nearlukverified character varying, rentalperiod character varying, perference character varying, propertytype character varying, areaname character varying, status character varying, userviewd integer, contactviewed character varying, user__id integer) 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin
-- return query 

-- select * from vw_GetFeaturedProperties1 pd  left outer join (select (pv.propertyid) as userviewd, pv.contactviewed, pv.userid  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=pd.id   where  pd.preference ilike '%'||Featured_name||'%' and pd.status='Active' limit page;

-- end

-- $BODY$;


CREATE OR REPLACE FUNCTION public.fn_getfeaturedpropertiesbyuserid(
	featured_name character varying,
	user_id integer,
	page integer)
    RETURNS TABLE(propertyname character varying, id integer, facing character varying, price bigint, posteddate date, nearlukverified character varying, rentalperiod character varying, perference character varying,propertyarea bigint, propertytype character varying, areaname character varying, status character varying, 
				  userviewd integer, contactviewed character varying, user__id integer) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query 

select * from vw_GetFeaturedProperties1 pd  left outer join (select (pv.propertyid) as userviewd, pv.contactviewed, pv.userid  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=pd.id   where  pd.preference ilike '%'||Featured_name||'%' and pd.status='Active' limit page;

end

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_viewallwithoutlocation(
	properttype character varying,
	page integer)
    RETURNS SETOF vw_getpropertydetailsbycityid 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query
select * from vw_getPropertydetailsByCityId a where a.propertytype ilike '%'||properttype||'%' and a.status='Active' order by propertyid desc limit page ;
end 
$BODY$;

ALTER FUNCTION public.fn_viewallwithoutlocation(character varying, integer)
    OWNER TO postgres;

    
CREATE OR REPLACE FUNCTION public.fn_getareaname(
	area_name character varying)
    RETURNS TABLE(userareaname text) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query 
	select (CONCAT(c.cityname,',',s.statename,',',co.countryname,',',a.areaname)) as cityname from city c join state s on s.id=c.stateid join country co on co.id=s.countryid join area a on a.cityid=c.id 
  where a.areaname ilike '%'||area_name||'%';
				   
				 
end
$BODY$;

ALTER FUNCTION public.fn_getareaname(character varying)
    OWNER TO postgres;
    


--  CREATE OR REPLACE FUNCTION public.fn_getrecentviewedproperties(
-- 	user_id integer,
-- 	page integer)
--     RETURNS SETOF vw_getrecentpropertyview 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$
-- begin
-- return query
-- select * from vw_getrecentpropertyview a where a.userid = user_id  and a.status='Active' limit page;
-- end 
-- $BODY$;

-- ALTER FUNCTION public.fn_getrecentviewedproperties(integer, integer)
--     OWNER TO postgres;


CREATE OR REPLACE FUNCTION public.fn_getrecentviewedproperties1(
	user_id integer,
	page integer)
    RETURNS SETOF vw_getrecentpropertyview 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query
select * from vw_getrecentpropertyview a where a.userid = user_id  and a.status='Active' order by propertyid desc limit page;
end 

$BODY$;

CREATE OR REPLACE FUNCTION public.fn_country_isd_select(
	cname character varying)
    RETURNS TABLE(isd_code character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query select  isdcode from country where  TRIM(BOTH FROM  LOWER(countryname)) =LOWER(cname);
end

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_registration_select_mobile1(
	mobil character varying)
    RETURNS TABLE(phone character varying, uid integer) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query select mobile,id from registration where mobile=mobil;
end

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_checkuserregisted1(
	mobilee character varying)
    RETURNS TABLE(uid integer, mail character varying, mobileno character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin

return query select id,email,mobile from Registration where mobile=mobilee;
end

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_filters(
	fc text[],
	pricemin bigint,
	pricemax bigint,
	nlvandnv text[],
	featuredtype character varying,
	page integer)
    RETURNS SETOF vw_filterssearchforfeatured 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query  select * from vw_filterssearchforfeatured fwr where 
fwr.facing = ANY(fc::text[]) and 
(fwr.price between pricemin::bigint and pricemax::bigint)  
and fwr.preference=featuredType and
fwr.nearlukverified =ANY(nlvandnv::text[]) limit page;
  end

$BODY$;



-- CREATE OR REPLACE FUNCTION public.fn_getbycitybyuserid(
-- 	param_cityid integer,
-- 	user_id integer,
-- 	page integer)
--     RETURNS TABLE(cityname character varying, areaname character varying, address character varying, pincode character varying, latitude numeric, longitude numeric, cityid integer, id integer, userid integer, propertytypeid integer, propertyname character varying, facing character varying, price bigint, description character varying, nearlukverified character varying, status character varying, posteddate date, propertyarea bigint, constructionstatus character varying, securitydeposit bigint, maintainancecost bigint, rentalperiod character varying, communityid integer, propertytype character varying, userviewd integer, user__id integer) 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$
-- begin
-- return query 
-- select * from vw_getbycity cty left outer join  
-- 	(select (pv.propertyid) as userviewd,pv.userid  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=cty.id  where cty.status='Active' 
-- and cty.cityid=param_cityid limit page;

-- end;
-- $BODY$;


-- CREATE OR REPLACE FUNCTION public.fn_getbycitybyuserid(
-- 	param_cityid integer,
-- 	user_id integer,
-- 	page integer)
--     RETURNS TABLE(cityname character varying, areaname character varying, address character varying, pincode character varying, latitude numeric, longitude numeric, cityid integer, id integer, userid integer, propertytypeid integer, propertyname character varying, facing character varying, price bigint, description character varying, nearlukverified character varying, status character varying, posteddate date, propertyarea bigint, constructionstatus character varying, securitydeposit bigint, maintainancecost bigint, rentalperiod character varying, communityid integer, propertytype character varying, userviewd integer, user__id integer, contactviewd character varying) 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$
-- begin
-- return query 
-- select * from vw_getbycity cty left outer join  
-- 	(select (pv.propertyid) as userviewd,pv.userid, pv.contactviewed  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=cty.id  where cty.status='Active' 
-- and cty.cityid=param_cityid limit page;

-- end;
-- $BODY$;


CREATE OR REPLACE FUNCTION public.fn_getbycitybyuserid1(
	param_cityid integer,
	user_id integer,
	page integer)
    RETURNS TABLE(cityname character varying, areaname character varying, address character varying, pincode character varying, latitude numeric, longitude numeric, cityid integer, id integer, userid integer, propertytypeid integer, propertyname character varying, facing character varying, price bigint, description character varying, nearlukverified character varying, status character varying, posteddate date, propertyarea bigint, constructionstatus character varying, securitydeposit bigint, maintainancecost bigint, rentalperiod character varying, communityid integer, propertytype character varying, userviewd integer, user__id integer, contactviewd character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query 
select * from vw_getbycity cty left outer join  
	(select (pv.propertyid) as userviewd,pv.userid, pv.contactviewed  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=cty.id  where cty.status='Active' 
and cty.cityid=param_cityid order by id desc limit page;

end;

$BODY$;



-- CREATE OR REPLACE FUNCTION public.fn_getpropertynamebycityiduserid(
-- 	citiesid bigint,
-- 	properttype character varying,
-- 	user_id integer,
-- 	page integer)
--     RETURNS TABLE(posteddate date, areaid integer, price bigint, stateid integer, cityid integer, propertyname character varying, propertytype character varying, areaname character varying, cityname character varying, propertyid integer, rentalperiod character varying, status character varying, userviewd integer, user__id integer) 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$
-- begin
-- return query
-- select * from vw_getPropertydetailsByCityId a left outer join (select (pv.propertyid) as userviewd,pv.userid  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=a.propertyid
-- where a.cityid = citiesid and a.propertytype ilike '%'||properttype||'%' and a.status='Active' limit page;
-- end 
-- $BODY$;


-- CREATE OR REPLACE FUNCTION public.fn_getpropertynamebycityiduserid(
-- citiesid bigint,
-- properttype character varying,
-- user_id integer,
-- page integer)
--     RETURNS TABLE(posteddate date, areaid integer, price bigint, stateid integer, cityid integer, propertyname character varying, propertytype character varying, areaname character varying, cityname character varying, propertyid integer, rentalperiod character varying, status character varying, userviewd integer, user__id integer, contactviewed character varying) 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$
-- begin
-- return query
-- select * from vw_getPropertydetailsByCityId a left outer join (select (pv.propertyid) as userviewd,pv.userid,pv.contactviewed from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=a.propertyid
-- where a.cityid = citiesid and a.propertytype ilike '%'||properttype||'%' and a.status='Active' limit page;
-- end 
-- $BODY$;

CREATE OR REPLACE FUNCTION public.fn_getpropertynamebycityiduserid1(
	citiesid bigint,
	properttype character varying,
	user_id integer,
	page integer)
    RETURNS TABLE(posteddate date, areaid integer, price bigint, stateid integer, cityid integer, propertyname character varying, propertytype character varying, areaname character varying, cityname character varying, propertyid integer, rentalperiod character varying, status character varying, userviewd integer, user__id integer, contactviewed character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
return query
select * from vw_getPropertydetailsByCityId a left outer join (select (pv.propertyid) as userviewd,pv.userid,pv.contactviewed from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=a.propertyid
where a.cityid = citiesid and a.propertytype ilike '%'||properttype||'%' and a.status='Active' order by propertyid desc limit page;
end 

$BODY$;



-- CREATE OR REPLACE FUNCTION public.fn_filtersbyuserid(
-- 	fc text[],
-- 	pricemin bigint,
-- 	pricemax bigint,
-- 	nlvandnv text[],
-- 	featuredtype character varying,
-- 	user_id integer,
-- 	page integer)
--     RETURNS TABLE(propertyid integer, userid integer, propertyname character varying, facing character varying, price bigint, propertytypeid integer, description character varying, nearlukverified character varying, status character varying, posteddate date, propertyarea bigint, cityid integer, rentalperiod character varying, latitude numeric, longitude numeric, rating numeric, areaname character varying, communityname character varying, propertytype character varying, preference character varying,userviewd integer, user__id integer) 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin 
-- return query  select * from vw_filterssearchforfeatured fwr left outer join    (select (pv.propertyid) as userviewd,pv.userid  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=fwr.propertyid where 
-- fwr.facing = ANY(fc::text[]) and 
-- (fwr.price between pricemin::bigint and pricemax::bigint)  
-- and fwr.preference=featuredType and
-- fwr.nearlukverified =ANY(nlvandnv::text[]) limit page;
--   end

-- $BODY$;

CREATE OR REPLACE FUNCTION public.fn_filtersbyuserid(
	fc text[],
	pricemin bigint,
	pricemax bigint,
	nlvandnv text[],
	featuredtype character varying,
	user_id integer,
	page integer)
    RETURNS TABLE(propertyid integer, userid integer, propertyname character varying, facing character varying, price bigint, propertytypeid integer, description character varying, nearlukverified character varying, status character varying, posteddate date, propertyarea bigint, cityid integer, rentalperiod character varying, latitude numeric, longitude numeric, rating numeric, areaname character varying, communityname character varying, propertytype character varying, preference character varying, userviewd integer, user__id integer,contactviewed character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query  select * from vw_filterssearchforfeatured fwr left outer join    (select (pv.propertyid) as userviewd,pv.userid,pv.contactviewed  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=fwr.propertyid where 
fwr.facing = ANY(fc::text[]) and 
(fwr.price between pricemin::bigint and pricemax::bigint)  
and fwr.preference=featuredType and
fwr.nearlukverified =ANY(nlvandnv::text[]) limit page;
  end

$BODY$;



CREATE OR REPLACE FUNCTION public.fn_recomendationswitharea(
	ctyid integer,
	country_id integer,
	state_id integer,
	area_id integer,
	ptype integer[],
	fc text[],
	pricemin integer,
	pricemax bigint,
	page integer)
    RETURNS SETOF vw_recomendations 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query  select * from vw_recomendations fwr  where 
fwr.cityid= ctyid and fwr.countryid= country_id and fwr.stateid= state_id and fwr.areaid= area_id  and  fwr.facing = ANY(fc::text[]) and 
(fwr.price between pricemin::int and pricemax::int)  
 and fwr.propertytypeid = ANY(ptype::int[]) order by fwr.propertyid desc limit page;
  end
						 

$BODY$;

CREATE OR REPLACE FUNCTION public.fn_recomendationswithoutarea(
ctyid integer,
country_id integer,
state_id integer,
ptype integer[],
fc text[],
pricemin integer,
pricemax bigint,
page integer)
RETURNS SETOF vw_recomendations 
LANGUAGE 'plpgsql'

COST 100
VOLATILE 
ROWS 1000
AS $BODY$

begin 
return query select * from vw_recomendations fwr where 
fwr.cityid= ctyid and fwr.countryid= country_id and fwr.stateid= state_id and fwr.facing = ANY(fc::text[]) and 
(fwr.price between pricemin::int and pricemax::int) 
and fwr.propertytypeid = ANY(ptype::int[]) order by fwr.propertyid desc limit page;
end


$BODY$;


-- CREATE OR REPLACE FUNCTION public.fn_filterswithratinguserid(
-- 	ctyid integer,
-- 	ptype integer[],
-- 	fc text[],
-- 	pricemin integer,
-- 	pricemax integer,
-- 	nlvandnv text[],
-- 	page integer,
-- 	rat integer)
--     RETURNS SETOF vw_filterssearch 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin 
-- return query  select * from vw_filterssearch fwr where 
-- fwr.cityid= ctyid  and  fwr.facing = ANY(fc::text[]) and 
-- (fwr.price between pricemin::int and pricemax::int)  
--  and fwr.propertytypeid = ANY(ptype::int[]) and
-- fwr.nearlukverified =ANY(nlvandnv::text[]) and fwr.rating<=rat limit page;
--   end

-- $BODY$;

CREATE OR REPLACE FUNCTION public.fn_filterswithratinguserid1(
	ctyid integer,
	ptype integer[],
	fc text[],
	pricemin integer,
	pricemax integer,
	nlvandnv text[],
	page integer,
	rat integer)
    RETURNS SETOF vw_filterssearch 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query  select * from vw_filterssearch fwr where 
fwr.cityid= ctyid  and  fwr.facing = ANY(fc::text[]) and 
(fwr.price between pricemin::int and pricemax::int)  
 and fwr.propertytypeid = ANY(ptype::int[]) and
fwr.nearlukverified =ANY(nlvandnv::text[]) and fwr.rating<=rat  order by propertyid desc limit page;
  end

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_filterswithratinguseridnew(
	ctyid integer,
	ptype integer[],
	fc text[],
	pricemin integer,
	pricemax integer,
	nlvandnv text[],
	page integer,
	rat integer,
	off_set integer)
    RETURNS SETOF vw_filterssearch 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query  select * from vw_filterssearch fwr where 
fwr.cityid= ctyid  and  fwr.facing = ANY(fc::text[]) and 
(fwr.price between pricemin::int and pricemax::int)  
 and fwr.propertytypeid = ANY(ptype::int[]) and
fwr.nearlukverified =ANY(nlvandnv::text[]) and fwr.rating<=rat order by fwr.propertyid desc limit page offset off_set;
  end

$BODY$;




-- CREATE OR REPLACE FUNCTION public.fn_filterswithoutratinguserid(
-- 	ctyid integer,
-- 	ptype integer[],
-- 	fc text[],
-- 	pricemin integer,
-- 	pricemax integer,
-- 	nlvandnv text[],
-- 	page integer)
--     RETURNS SETOF vw_filterssearch 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin 
-- return query  select * from vw_filterssearch fwr where 
-- fwr.cityid= ctyid  and  fwr.facing = ANY(fc::text[]) and 
-- (fwr.price between pricemin::int and pricemax::int)  
--  and fwr.propertytypeid = ANY(ptype::int[]) and
-- fwr.nearlukverified =ANY(nlvandnv::text[]) limit page;

--   end

-- $BODY$;


CREATE OR REPLACE FUNCTION public.fn_filterswithoutratinguserid1(
	ctyid integer,
	ptype integer[],
	fc text[],
	pricemin integer,
	pricemax integer,
	nlvandnv text[],
	page integer)
    RETURNS SETOF vw_filterssearch 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query  select * from vw_filterssearch fwr where 
fwr.cityid= ctyid  and  fwr.facing = ANY(fc::text[]) and 
(fwr.price between pricemin::int and pricemax::int)  
 and fwr.propertytypeid = ANY(ptype::int[]) and
fwr.nearlukverified =ANY(nlvandnv::text[]) order by propertyid desc limit page;

  end

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_filterswithoutratinguseridnew(
	ctyid integer,
	ptype integer[],
	fc text[],
	pricemin integer,
	pricemax integer,
	nlvandnv text[],
	page integer,
	off_set integer)
    RETURNS SETOF vw_filterssearch 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query  select * from vw_filterssearch fwr where 
fwr.cityid= ctyid  and  fwr.facing = ANY(fc::text[]) and 
(fwr.price between pricemin::int and pricemax::int)  
 and fwr.propertytypeid = ANY(ptype::int[]) and
fwr.nearlukverified =ANY(nlvandnv::text[]) order by fwr.propertyid desc limit page offset off_set;

  end

$BODY$;



CREATE OR REPLACE FUNCTION public.fn_getallfeartued(
	page integer)
    RETURNS SETOF vw_getallfeartued 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query
select * from vw_getallfeartued vgf where vgf.preference in('Bachelors','Families','Gated Community','OfficeSpaces','OfficeSpaces','Banquet halls','Hostels PG','Sharing Spaces','Bachelors or Families') and  vgf.status='Active' order by vgf.id desc limit page;
end 
$BODY$;


CREATE OR REPLACE FUNCTION public.fn_getcityautofill2(
city_name character varying)
    RETURNS TABLE(cityid bigint, usercityname text) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query 
select c.id,(CONCAT(c.cityname,',',s.statename,',',co.countryname)) as cityname from city c join state s on s.id=c.stateid join country co on co.id=s.countryid 
  where c.cityname ilike '%'||city_name||'%';
  

end
$BODY$;

CREATE OR REPLACE FUNCTION public.fn_getareaautofill2(
area_name character varying)
    RETURNS TABLE(id bigint, areaname text) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query 
select ar.id,(CONCAT(ar.areaname,',',c.cityname,',',s.statename,',',co.countryname)) as cityname from city c join state s on s.id=c.stateid join country co on co.id=s.countryid join area ar on ar.cityid=c.id 
  where TRIM(BOTH FROM  LOWER(ar.areaname)) ilike LOWER ( area_name||'%') or TRIM(BOTH FROM  LOWER(c.cityname)) ilike LOWER ( area_name||'%');
  

end
$BODY$;



CREATE OR REPLACE FUNCTION public.fn_filterswithratinguseridnewwitharea(
	arid integer,
	ptype integer[],
	fc text[],
	pricemin integer,
	pricemax integer,
	nlvandnv text[],
	page integer,
	rat integer,
	off_set integer)
    RETURNS SETOF vw_filterssearch 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query  select * from vw_filterssearch fwr where 
fwr.areaid= arid  and  fwr.facing = ANY(fc::text[]) and 
(fwr.price between pricemin::int and pricemax::int)  
 and fwr.propertytypeid = ANY(ptype::int[]) and
fwr.nearlukverified =ANY(nlvandnv::text[]) and fwr.rating<=rat order by fwr.propertyid desc limit page offset off_set;
  end

$BODY$;



CREATE OR REPLACE FUNCTION public.fn_filterswithratingpaginationnewwitharea(
	arid integer,
	ptype integer[],
	fc text[],
	pricemin integer,
	pricemax integer,
	nlvandnv text[],
	page integer,
	rat integer,
	user_id integer,
	off_set integer)
    RETURNS TABLE(propertyid integer, userid integer, propertyname character varying, facing character varying, price bigint, propertytypeid integer, description character varying, nearlukverified character varying, status character varying, posteddate date, propertyarea bigint, cityid integer, rentalperiod character varying, latitude numeric, longitude numeric, rating numeric, areaname character varying, communityname character varying, propertytype character varying,area_id integer, userviewd integer, user__id integer) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query  select * from vw_filterssearch fwr left outer join (select (pv.propertyid) as userviewd,pv.userid  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=fwr.propertyid where 
fwr.areaid= arid  and  fwr.facing = ANY(fc::text[]) and 
(fwr.price between pricemin::int and pricemax::int)  
 and fwr.propertytypeid = ANY(ptype::int[]) and
fwr.nearlukverified =ANY(nlvandnv::text[]) and fwr.rating<=rat order by fwr.propertyid desc limit page offset off_set; 
  end
						 

$BODY$;



CREATE OR REPLACE FUNCTION public.fn_filterswithoutratinguseridnewwitharea(
	arid integer,
	ptype integer[],
	fc text[],
	pricemin integer,
	pricemax integer,
	nlvandnv text[],
	page integer,
	off_set integer)
    RETURNS SETOF vw_filterssearch 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query  select * from vw_filterssearch fwr where 
fwr.areaid= arid  and  fwr.facing = ANY(fc::text[]) and 
(fwr.price between pricemin::int and pricemax::int)  
 and fwr.propertytypeid = ANY(ptype::int[]) and
fwr.nearlukverified =ANY(nlvandnv::text[]) order by fwr.propertyid desc limit page offset off_set;

  end

$BODY$;


-- CREATE OR REPLACE FUNCTION public.fn_filterswithoutratingpaginationnewwitharea(
-- 	arid integer,
-- 	ptype integer[],
-- 	fc text[],
-- 	pricemin integer,
-- 	pricemax integer,
-- 	nlvandnv text[],
-- 	page integer,
-- 	user_id integer,
-- 	off_set integer)
--     RETURNS TABLE(propertyid integer, userid integer, propertyname character varying, facing character varying, price bigint, propertytypeid integer, description character varying, nearlukverified character varying, status character varying, posteddate date, propertyarea bigint, cityid integer, rentalperiod character varying, latitude numeric, longitude numeric, rating numeric, areaname character varying, communityname character varying, propertytype character varying,area_id integer, userviewd integer, user__id integer) 
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
--     ROWS 1000
-- AS $BODY$

-- begin 
-- return query  select * from vw_filterssearch fwr  left outer join (select (pv.propertyid) as userviewd,pv.userid  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=fwr.propertyid where 
-- fwr.areaid= arid  and  fwr.facing = ANY(fc::text[]) and 
-- (fwr.price between pricemin::int and pricemax::int)  
--  and fwr.propertytypeid = ANY(ptype::int[]) and
-- fwr.nearlukverified =ANY(nlvandnv::text[])  order by fwr.propertyid desc limit page offset off_set;

--   end

-- $BODY$;



CREATE OR REPLACE FUNCTION public.fn_filterswithoutratingpaginationnewwitharea(
	arid integer,
	ptype integer[],
	fc text[],
	pricemin integer,
	pricemax integer,
	nlvandnv text[],
	page integer,
	user_id integer,
	off_set integer)
    RETURNS TABLE(propertyid integer, userid integer, propertyname character varying, facing character varying, price bigint, propertytypeid integer, description character varying, nearlukverified character varying, status character varying, posteddate date, propertyarea bigint, cityid integer, rentalperiod character varying, latitude numeric, longitude numeric, rating numeric, areaname character varying, communityname character varying, propertytype character varying, area_id integer, userviewd integer, user__id integer,contactviewed character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query  select * from vw_filterssearch fwr  left outer join (select (pv.propertyid) as userviewd,pv.userid,pv.contactviewed  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=fwr.propertyid where 
fwr.areaid= arid  and  fwr.facing = ANY(fc::text[]) and 
(fwr.price between pricemin::int and pricemax::int)  
 and fwr.propertytypeid = ANY(ptype::int[]) and
fwr.nearlukverified =ANY(nlvandnv::text[])  order by fwr.propertyid desc limit page offset off_set;

  end

$BODY$;



CREATE OR REPLACE FUNCTION public.fn_getbycitybyuserid1new(
	param_cityid integer,
	user_id integer,
	page integer,
	off_set integer)
    RETURNS TABLE(cityname character varying, areaname character varying, address character varying, pincode character varying, latitude numeric, longitude numeric, cityid integer, id integer, userid integer, propertytypeid integer, propertyname character varying, facing character varying, price bigint, description character varying, nearlukverified character varying, status character varying, posteddate date, propertyarea bigint, constructionstatus character varying, securitydeposit bigint, maintainancecost bigint, rentalperiod character varying, communityid integer, propertytype character varying, userviewd integer, user__id integer,contactviewd character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query 
select * from vw_getbycity cty left outer join  
	(select (pv.propertyid) as userviewd,pv.userid,pv.contactviewed from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=cty.id  where cty.status='Active' 
and cty.cityid=param_cityid order by cty.id desc limit page offset off_set ;

end;
$BODY$;


CREATE OR REPLACE FUNCTION public.fn_getbycitynew(
	param_cityid integer,
	page integer,
	off_set integer)
    RETURNS SETOF vw_getbycity 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query 
select * from vw_getbycity where status='Active' 
and cityid=param_cityid order by id desc limit page offset off_set ;

end;
$BODY$;


CREATE OR REPLACE FUNCTION public.fn_getmyproperty1new(
	user_id integer,
	param_limit integer,
	off_set integer)
    RETURNS SETOF vw_mypropertys 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
 return query
  select * from vw_mypropertys where userid=user_id 
  and status in('Active','Inactive') ORDER BY posteddate DESC  limit param_limit offset off_set;
 
 end;
 
$BODY$;

CREATE OR REPLACE FUNCTION public.fn_viewallwithoutlocationnew(
	properttype character varying,
	page integer,
	off_set integer)
    RETURNS SETOF vw_getpropertydetailsbycityid 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query
select * from vw_getPropertydetailsByCityId a where a.propertytype ilike '%'||properttype||'%' and a.status='Active' order by propertyid desc limit page offset off_set ;
end 
$BODY$;

CREATE OR REPLACE FUNCTION public.fn_viewallwithoutlocationuseridnew(
	properttype character varying,
	user_id integer,
	page integer,
	off_set integer)
    RETURNS TABLE(posteddate date, areaid integer, price bigint, stateid integer, cityid integer, propertyname character varying, propertytype character varying, areaname character varying, cityname character varying, propertyid integer, rentalperiod character varying, status character varying, userviewd integer, user__id integer, contactviewed character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query
select * from vw_getPropertydetailsByCityId a left outer join (select (pv.propertyid) as userviewd,pv.userid,pv.contactviewed from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=a.propertyid
where a.propertytype ilike '%'||properttype||'%' and a.status='Active' order by a.propertyid desc limit page offset off_set ;
end 
$BODY$;




CREATE OR REPLACE FUNCTION public.fn_getpropertynamebycityiduserid1new(
	citiesid bigint,
	properttype character varying,
	user_id integer,
	page integer,
	off_set integer)
    RETURNS TABLE(posteddate date, areaid integer, price bigint, stateid integer, cityid integer, propertyname character varying, propertytype character varying, areaname character varying, cityname character varying, propertyid integer, rentalperiod character varying, status character varying, userviewd integer, user__id integer, contactviewed character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query
select * from vw_getPropertydetailsByCityId a left outer join (select (pv.propertyid) as userviewd,pv.userid,pv.contactviewed  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=a.propertyid
where a.cityid = citiesid and a.propertytype ilike '%'||properttype||'%' and a.status='Active' order by a.propertyid desc limit page offset off_set ;
end 
$BODY$;



CREATE OR REPLACE FUNCTION public.fn_getpropertynamebycityid1new(
	citiesid bigint,
	properttype character varying,
	page integer,
	off_set integer)
    RETURNS SETOF vw_getpropertydetailsbycityid 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
begin
return query
select * from vw_getPropertydetailsByCityId a where a.cityid = citiesid and a.propertytype ilike '%'||properttype||'%' and a.status='Active'  order by a.propertyid desc limit page offset off_set ;
end 
$BODY$;


CREATE OR REPLACE FUNCTION public.fn_getmyfavouritesnew(
	user_id integer,
	param_limit integer,
	off_set integer)
    RETURNS TABLE(id integer, propertyname character varying, price bigint, rentalperiod character varying, propertytype character varying, cityname character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin
 return query
 select pd.id,pd.propertyname,pd.price,pd.rentalperiod,pt.propertytype,c.cityname from 
propertydetails pd left join favourites f on pd.id=f.propertyid left join
propertytypes pt on pt.id=pd.propertytypeid left join propertyaddress padd on padd.propertyid=pd.id
left join city c on padd.cityid=c.id where f.userid=user_id and pd.status='Active' order by pd.id desc limit param_limit offset off_set ;
 end;
 
$BODY$;

CREATE OR REPLACE FUNCTION public.fn_recomendationswithareanew(
	ctyid integer,
	country_id integer,
	state_id integer,
	area_id integer,
	ptype integer[],
	fc text[],
	pricemin integer,
	pricemax bigint,
	page integer,
	offsett integer)
    RETURNS SETOF vw_recomendations 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query  select * from vw_recomendations fwr  where 
fwr.cityid= ctyid and fwr.countryid= country_id and fwr.stateid= state_id and fwr.areaid= area_id  and  fwr.facing = ANY(fc::text[]) and 
(fwr.price between pricemin::int and pricemax::int)  
 and fwr.propertytypeid = ANY(ptype::int[]) order by fwr.propertyid desc limit page offset offsett;
  end
						 

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_recomendationswithoutareanew(
	ctyid integer,
	country_id integer,
	state_id integer,
	ptype integer[],
	fc text[],
	pricemin integer,
	pricemax bigint,
	page integer,
	offsett integer)
    RETURNS SETOF vw_recomendations 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query select * from vw_recomendations fwr where 
fwr.cityid= ctyid and fwr.countryid= country_id and fwr.stateid= state_id and fwr.facing = ANY(fc::text[]) and 
(fwr.price between pricemin::int and pricemax::int) 
and fwr.propertytypeid = ANY(ptype::int[]) order by fwr.propertyid desc limit page offset offsett;
end

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_filtersnew(
	fc text[],
	pricemin bigint,
	pricemax bigint,
	nlvandnv text[],
	featuredtype character varying,
	page integer,
	offsett integer)
    RETURNS SETOF vw_filterssearchforfeatured 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query  select * from vw_filterssearchforfeatured fwr where 
fwr.facing = ANY(fc::text[]) and 
(fwr.price between pricemin::bigint and pricemax::bigint)  
and fwr.preference=featuredType and
fwr.nearlukverified =ANY(nlvandnv::text[]) and fwr.status='Active' order by fwr.propertyid desc limit page offset offsett;
  end

$BODY$;


CREATE OR REPLACE FUNCTION public.fn_filtersbyuseridnew(
	fc text[],
	pricemin bigint,
	pricemax bigint,
	nlvandnv text[],
	featuredtype character varying,
	user_id integer,
	page integer,
	offsett integer)
    RETURNS TABLE(propertyid integer, userid integer, propertyname character varying, facing character varying, price bigint, propertytypeid integer, description character varying, nearlukverified character varying, status character varying, posteddate date, propertyarea bigint, cityid integer, rentalperiod character varying, latitude numeric, longitude numeric, rating numeric, areaname character varying, communityname character varying, propertytype character varying, preference character varying, userviewd integer, user__id integer, contactviewed character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

begin 
return query  select * from vw_filterssearchforfeatured fwr left outer join    (select (pv.propertyid) as userviewd,pv.userid,pv.contactviewed  from propertyviews pv where pv.userid=user_id) as v1 on v1.userviewd=fwr.propertyid where 
fwr.facing = ANY(fc::text[]) and 
(fwr.price between pricemin::bigint and pricemax::bigint)  
and fwr.preference=featuredType and
fwr.nearlukverified =ANY(nlvandnv::text[]) and fwr.status='Active' order by fwr.propertyid desc limit page offset offsett;
  end

$BODY$;





